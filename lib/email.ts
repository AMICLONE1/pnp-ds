import { Resend } from "resend";

// Lazy initialization to avoid build-time errors when RESEND_API_KEY is not set
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Email sending is disabled.");
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

// Free tier: only sends to your Resend account email via onboarding@resend.dev
// To send to any user: verify your domain in Resend dashboard and change to e.g. "PNP Digital Solar <hello@yourdomain.com>"
const FROM_EMAIL = "PNP Digital Solar <onboarding@resend.dev>";
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "info@powernetpro.com";

export function buildContactMailtoUrl(input: {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}) {
  const subject = encodeURIComponent(`[Contact] ${input.subject}`);
  const body = encodeURIComponent(
    [
      "New Contact Message",
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Phone: ${input.phone?.trim() || "Not provided"}`,
      `Subject: ${input.subject}`,
      "",
      input.message,
    ].join("\n")
  );

  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

export async function sendWaitlistWelcomeEmail(
  email: string,
  name?: string | null,
  position?: number | null
) {
  const resend = getResendClient();
  if (!resend) return null;

  const displayName = name || "there";

  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Welcome to the PNP Digital Solar Waitlist!",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #d97706; font-size: 24px; margin: 0;">☀️ PNP Digital Solar</h1>
        </div>

        <h2 style="color: #111; font-size: 20px;">Hey ${displayName}!</h2>

        <p style="color: #444; font-size: 16px; line-height: 1.6;">
          Thank you for joining our waitlist! You're now in line for early access to PNP Digital Solar —
          a smarter way to save on electricity with community solar.
        </p>

        ${position ? `<p style="color: #444; font-size: 16px; line-height: 1.6;">You're <strong>#${position}</strong> on the waitlist.</p>` : ""}

        <div style="background: #fffbeb; border: 1px solid #fbbf24; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 600;">What happens next?</p>
          <ul style="color: #78350f; font-size: 14px; line-height: 1.8; padding-left: 20px;">
            <li>We'll notify you as soon as we launch</li>
            <li>Early members get priority access and founder pricing</li>
            <li>No commitment required — just stay tuned</li>
          </ul>
        </div>

        <p style="color: #888; font-size: 13px; margin-top: 32px; text-align: center;">
          You received this because you signed up at PNP Digital Solar.
        </p>
      </div>
    `,
  });
}

export async function sendAdminWaitlistNotification(
  email: string,
  name?: string | null,
  phone?: string | null,
  position?: number | null
) {
  const resend = getResendClient();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!resend || !adminEmail) return null;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: adminEmail,
    subject: `New Waitlist Signup: ${email}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #111;">New Waitlist Signup</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; color: #666; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td></tr>
          <tr><td style="padding: 8px; color: #666; border-bottom: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name || "Not provided"}</td></tr>
          <tr><td style="padding: 8px; color: #666; border-bottom: 1px solid #eee;"><strong>Phone</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${phone || "Not provided"}</td></tr>
          ${position ? `<tr><td style="padding: 8px; color: #666; border-bottom: 1px solid #eee;"><strong>Position</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">#${position}</td></tr>` : ""}
        </table>
      </div>
    `,
  });
}

export async function sendContactMessageNotification(input: {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}) {
  const resend = getResendClient();

  if (!resend) return null;

  const phone = input.phone?.trim() || "Not provided";

  return resend.emails.send({
    from: FROM_EMAIL,
    to: CONTACT_EMAIL,
    replyTo: input.email,
    subject: `[Contact] ${input.subject}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; color: #111827;">
        <h2 style="margin: 0 0 16px; color: #b45309;">New Contact Message</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600; width: 140px; vertical-align: top;">Name</td>
            <td style="padding: 8px 0;">${input.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; width: 140px; vertical-align: top;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${input.email}" style="color: #b45309;">${input.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; width: 140px; vertical-align: top;">Phone</td>
            <td style="padding: 8px 0;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; width: 140px; vertical-align: top;">Subject</td>
            <td style="padding: 8px 0;">${input.subject}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; width: 140px; vertical-align: top;">Message</td>
            <td style="padding: 8px 0; white-space: pre-wrap; line-height: 1.6;">${input.message}</td>
          </tr>
        </table>
      </div>
    `,
    text: [
      "New Contact Message",
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Phone: ${phone}`,
      `Subject: ${input.subject}`,
      "",
      input.message,
    ].join("\n"),
  });
}
