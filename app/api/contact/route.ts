import { NextResponse } from "next/server";
import { z } from "zod";
import { buildContactMailtoUrl, sendContactMessageNotification } from "@/lib/email";
import { sanitizePhone, sanitizeText } from "@/lib/security/inputSanitizer";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address").max(254, "Email is too long"),
  phone: z.string().max(20, "Phone number is too long").optional().or(z.literal("")),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(120, "Subject is too long"),
  message: z.string().min(10, "Message must be at least 10 characters").max(4000, "Message is too long"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    const payload = {
      name: sanitizeText(validatedData.name).trim(),
      email: validatedData.email.trim().toLowerCase(),
      phone: validatedData.phone ? sanitizePhone(validatedData.phone).trim() : undefined,
      subject: sanitizeText(validatedData.subject).trim(),
      message: sanitizeText(validatedData.message).trim(),
    };

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: true,
        deliveryMode: "mailto",
        mailtoUrl: buildContactMailtoUrl(payload),
        message: "Your email app will open with info@powernetpro.com filled in.",
      });
    }

    const emailResult = await sendContactMessageNotification(payload);

    if (!emailResult) {
      return NextResponse.json(
        {
          success: true,
          deliveryMode: "mailto",
          mailtoUrl: buildContactMailtoUrl(payload),
          error: {
            code: "EMAIL_FALLBACK",
            message: "Opening your email app instead.",
          },
          message: "Your email app will open with info@powernetpro.com filled in.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      deliveryMode: "resend",
      message: "Your message has been sent to info@powernetpro.com.",
    });
  } catch (error: unknown) {
    console.error("Contact API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: error.errors[0].message,
          },
        },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : "Failed to send message";

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}