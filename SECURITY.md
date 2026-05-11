# Security

This document records the security posture of PowerNetPro as of the most
recent review. It is intended for internal engineering, prospective
customers, and auditors who need a concise account of what has been
tested and what remediation has been applied.

**Last reviewed:** 2026-05-11
**Reviewer:** Claude Code (Sonnet 4.6) acting under engineering direction
**Scope:** Cashfree payment integration, document upload feature, host
portal, subscriber dashboard, public marketing site

---

## 1. Reporting a vulnerability

If you discover a security issue, **do not open a public GitHub issue.**
Email the engineering team directly so we can triage privately. We
acknowledge reports within two business days and aim to ship fixes for
critical issues within five.

Out of scope: denial of service, rate limiting, missing security
headers on third-party domains we proxy through (Vercel SSO, Unsplash
image CDN, etc.), and advisories on transitive dependencies that are
not reachable from our code.

---

## 2. Threat model

PowerNetPro is a payments-bearing platform. The threats we actively
defend against, in priority order:

1. **Payment fraud** — stolen card / UPI usage, replay of valid Cashfree
   payments to mint free allocations, tampering with order amount.
2. **Account takeover** — credential stuffing, password guessing,
   session hijacking, role escalation from subscriber → host → admin.
3. **PII leakage** — exposure of customer phone, email, KYC IDs
   (Aadhaar, PAN), bank details to anyone outside the user's own
   session.
4. **Data tampering** — modification of host generation readings,
   billing amounts, or invoice records by anyone other than authorised
   admins / Trillectric ingestion path.
5. **Document integrity** — replacement of PPA agreements or insurance
   PDFs by unauthorised parties.

Threats out of scope for this review: physical access to admin
machines, social engineering of admin staff, supply-chain attacks via
compromised npm packages, side-channel attacks on Vercel's edge
network.

---

## 3. Security testing performed

### 3.1 Static code review

A senior-engineer-level review of every code path touched by the recent
Cashfree integration, documents feature, and host onboarding flows.

Eight findings were identified and remediated:

| # | Finding | Severity | Status |
|---|---|---|---|
| 1 | Path traversal via admin-controlled `spv_id` in storage paths | Medium | Fixed — `[A-Za-z0-9_.-]` allowlist + path regex guard |
| 2 | Content-Disposition filename injection via storage path extension | Medium | Fixed — extension whitelist + RFC 5987 encoding |
| 3 | MIME-type spoofing → stored XSS via tampered document path | Medium | Fixed — `X-Content-Type-Options: nosniff` + attachment disposition for non-PDF |
| 4 | No admin-tenant scoping on document replace endpoint | Medium | Documented model (single-tenant), soft-delete check added |
| 5 | Cashfree webhook replay window | Low | Fixed — 5-minute timestamp recency check |
| 6 | Customer PII (phone/email/GSTIN) in Cashfree error logs | Medium | Fixed — log only path/status/code/keys, never body |
| 7 | Webhook event-type confusion | Low | Fixed — strict allowlist of accepted event types |
| 8 | Hardcoded placeholder GSTIN in source | Low (compliance) | Moved to `CASHFREE_GSTIN` env var |

### 3.2 Active fuzzing (OWASP ZAP)

A full automated scan against a Vercel preview deployment. 333
endpoints discovered and fuzzed across the OWASP Top 10 plugin set
including SQL Injection (MySQL, PostgreSQL, Oracle, MsSQL,
Hypersonic), Cross Site Scripting (reflected, persistent, DOM-based),
Remote Code Execution (React2Shell, Shell Shock, CVE-2012-1823),
Remote OS Command Injection, Path Traversal, Remote File Inclusion,
XPath Injection, XML External Entity, Server-Side Template Injection,
SOAP injection, Log4Shell, Spring4Shell, and others.

**Result: 0 High, 0 exploitable Medium.**

Two CSP-related medium alerts surfaced from the scan and were resolved
in the same session:

- CSP header was missing → added global Content-Security-Policy via
  `next.config.js` `headers()` with `default-src 'self'`, allowlisted
  Cashfree SDK origins, blob: workers for the Drop-in checkout,
  Supabase Storage origin, and explicit `frame-ancestors 'none'` to
  block clickjacking.
- Contact form `<form>` element defaulted to GET method, putting the
  visitor's email/phone into the URL on a fallback submit → changed to
  `method="post"`.

Several other ZAP findings were triaged as false positives:

- "Cross-domain misconfiguration" flags `Access-Control-Allow-Origin: *`
  on Next.js static JS/CSS/font assets. CDN-hosted static content must
  be CORS-open for cross-origin asset loading; the API endpoints are
  not affected.
- "Timestamp disclosure" flagged Unix-like 10-digit numbers in image
  URLs. These are Unsplash photo IDs (e.g. `photo-1554224155-...`),
  not server timestamps.
- "Session management response identified" flagged the
  `_vercel_sso_nonce` cookie used to authenticate to the preview
  deployment. This cookie is Vercel SSO infrastructure, not part of
  PowerNetPro's session model.
- "Cache-Control" alerts flag Next.js's default
  `public, max-age=0, must-revalidate` on HTML pages. This is the
  recommended Next.js setting and is not a leak vector for our
  responses, which do not embed user-specific data in cacheable
  pages.

### 3.3 Dependency audit (`npm audit`)

Two moderate advisories outstanding, both transitive under Next.js:

- **GHSA-qx2v-qp2m-jg93** (`postcss < 8.5.10`): PostCSS can produce
  XSS-bearing output if a developer parses user-submitted CSS and
  re-stringifies it into a `<style>` tag at runtime. PowerNetPro does
  not accept user CSS at any point and processes its own static CSS
  only at build time. **Not exploitable.**
- The Next.js entry in the advisory inherits the postcss issue and is
  resolved by the same condition.

`npm audit fix --force` would downgrade Next.js from 16 to 9 — a
breaking change that is not justified by a non-exploitable advisory.
We track Next.js patch releases and will rebuild when a fix on the
16.x line is published.

---

## 4. Implemented controls

### 4.1 Authentication & authorisation

- Subscriber auth via Supabase Auth (email + bcrypt password, JWT
  session cookies).
- Host auth same backend, scoped role `HOST`, additional `hosts.status
  = 'ACTIVE'` gate at middleware level.
- Admin auth same backend, role `ADMIN`. All admin API routes call
  `verifyAdmin()` before any side effect.
- Middleware in `proxy.ts` enforces role at the route level so
  `/host/*`, `/admin/*`, and `/dashboard` cannot be reached by users
  outside their role.
- Public paths are listed explicitly in `lib/supabase/middleware.ts`;
  any unlisted route requires auth.

### 4.2 Payment integrity

- Cashfree order amounts are computed server-side from authoritative
  inputs (`calculateAllocationPrice`,
  `calculateHostBillingSummary`). The client never controls the
  amount.
- Cashfree webhook verifies HMAC-SHA256 signature using
  `crypto.timingSafeEqual` to prevent timing-oracle bypass.
- Webhook payloads are rejected if the `x-webhook-timestamp` is more
  than ±300 seconds from server time, preventing replay of captured
  payloads.
- Webhook event types outside an explicit allowlist are silently
  ignored.
- Payment completion is idempotent — re-receiving a
  PAYMENT_SUCCESS_WEBHOOK for an already-COMPLETED order is a no-op.

### 4.3 Data protection

- KYC fields (Aadhaar, PAN) stored in dedicated columns in
  `public.users` with row-level security; no public API exposes them.
- Cashfree request bodies are never logged. On error the server logs
  only path, HTTP status, error code, and the *keys* of the sent body
  (not values).
- Document downloads serve files with `X-Content-Type-Options: nosniff`
  and force `attachment` disposition for any non-PDF extension to
  prevent same-origin HTML/SVG rendering of tampered files.
- Document upload paths sanitised against traversal sequences (`..`,
  leading `/`).

### 4.4 Network & transport

- HTTPS enforced via HSTS (`max-age=63072000; includeSubDomains;
  preload`).
- Content-Security-Policy applied to all responses; allowlists only
  Cashfree, Supabase, font CDNs, and `self`.
- `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'` block
  clickjacking.
- `Referrer-Policy: strict-origin-when-cross-origin` prevents
  cross-site referrer leakage.
- `Permissions-Policy` denies camera, microphone, geolocation, and
  FLoC interest cohorts by default.

### 4.5 Operational

- Database mutations from admin-side document replacement write
  `audit_log` rows recording the actor, action, and old/new storage
  paths.
- Rate limiting per IP on signup and contact endpoints via
  `lib/security/rateLimiter`.
- Vercel "Deployment Protection" gates preview deployments; only
  authenticated team members or bearers of a rotation-controlled
  bypass secret can access them.

---

## 5. Accepted residual risks

These are known limitations that we have consciously chosen not to
address at this time:

1. **CSP includes `'unsafe-inline'` and `'unsafe-eval'` in
   `script-src`.** Required for Next.js's runtime hydration and dev
   tooling. Removing them would require nonce-based CSP via a custom
   server, which is more invasive than warranted today.
2. **PPA and insurance documents are public.** Per product decision,
   prospective subscribers should be able to read the PPA before
   signing up. Admins are responsible for redacting bank account
   numbers and signatures from documents before upload.
3. **No 2FA for admin accounts.** Admin accounts are few (single-digit
   count today) and protected by long passwords. Supabase Auth supports
   TOTP; we will enable it before the admin pool grows.
4. **CASHFREE_WEBHOOK_SECRET defaults to CASHFREE_SECRET_KEY.** Cashfree
   does not always expose a separate webhook secret in the merchant
   dashboard; in those cases our verification code falls back to the
   API secret key. Both code paths use the same HMAC-SHA256 algorithm.
5. **Subscriber documents (Aadhaar / PAN images, if uploaded later)
   are not yet covered by this review.** The current scope is the
   live signup flow, which captures KYC numbers but not document
   scans.

---

## 6. How to verify the security posture yourself

Anyone reading this document can independently confirm the security
headers are live:

```bash
curl -I https://www.powernetpro.com/
```

You should see, at minimum:

```
Content-Security-Policy: default-src 'self'; ...
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
```

To verify webhook signature handling, inspect
`lib/payments/cashfree.ts` `verifyCashfreeWebhook()` and the webhook
handler in `app/api/payments/webhook/route.ts`.

To verify payment-amount server authority, inspect
`app/api/signup/init/route.ts` and `app/api/signup/complete/route.ts`
— both re-compute the price server-side via `calculateAllocationPrice`
and reject any mismatch.

---

## 7. Re-test schedule

- After every change to `lib/payments/*`, `app/api/payments/**`,
  `app/api/admin/**`, or `app/api/host/**` — run static review on the
  diff.
- Before each production release that touches the payment or KYC
  surface — re-run OWASP ZAP against a Vercel preview deployment.
- Quarterly — run `npm audit` and evaluate new advisories.
- Annually — full static + dynamic + dependency review documented
  here.

---

*This document reflects the testing performed up to the date in the
header. It is not a guarantee of absence of vulnerabilities, only an
honest account of what has been examined and what remains.*
