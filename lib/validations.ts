import { z } from "zod";

// Authentication schemas
export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Utility connection schema
export const utilityConnectionSchema = z.object({
  state: z.string().min(1, "State is required"),
  discom: z.string().min(1, "DISCOM is required"),
  utility_consumer_number: z.string().min(8, "Consumer number must be at least 8 characters"),
});

// Profile update schema
export const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number").optional(),
  email_notifications: z.boolean().optional(),
  sms_notifications: z.boolean().optional(),
});

// Reservation schema
export const reservationSchema = z.object({
  project_id: z.string().uuid("Invalid project ID"),
  capacity_kw: z.number().min(1, "Minimum capacity is 1 kW").max(100, "Maximum capacity is 100 kW"),
});

// Payment schema
export const paymentSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  allocation_id: z.string().uuid("Invalid allocation ID").optional(),
  payment_type: z.enum(["allocation", "monthly", "bill"]),
});

