import crypto from "crypto";

/**
 * Hash a password using Node's built-in scrypt — no extra deps, FIPS-grade.
 * Output format: `scrypt$N$r$p$saltHex$hashHex` so the params travel with the
 * hash (we can tune cost later without breaking existing rows).
 *
 * NOTE: pending_signups stores this hash only briefly — once the user pays
 * and a real auth.users row is created via supabase.auth.admin.createUser,
 * the pending row is deleted. Supabase manages its own (also strong) hash
 * for the canonical credential going forward.
 */
const N = 16384; // CPU/memory cost
const r = 8;
const p = 1;
const KEYLEN = 64;
const SALT_BYTES = 16;

export function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(SALT_BYTES);
    crypto.scrypt(password, salt, KEYLEN, { N, r, p }, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`scrypt$${N}$${r}$${p}$${salt.toString("hex")}$${derivedKey.toString("hex")}`);
    });
  });
}

export function verifyPassword(password: string, stored: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const parts = stored.split("$");
    if (parts.length !== 6 || parts[0] !== "scrypt") return resolve(false);
    const N = parseInt(parts[1], 10);
    const r = parseInt(parts[2], 10);
    const p = parseInt(parts[3], 10);
    const salt = Buffer.from(parts[4], "hex");
    const expected = Buffer.from(parts[5], "hex");
    crypto.scrypt(password, salt, expected.length, { N, r, p }, (err, derivedKey) => {
      if (err) return reject(err);
      // Constant-time compare
      try {
        resolve(crypto.timingSafeEqual(expected, derivedKey));
      } catch {
        resolve(false);
      }
    });
  });
}
