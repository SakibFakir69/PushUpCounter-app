import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Required")
  .pipe(z.email("Enter a valid email"));

export const loginSchema = z.object({
  email: z.string().min(1, "Required").pipe(z.email("Enter a valid email")),
  password: z.string().min(1, "Required").min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: emailSchema,
  password: z
    .string()
    .min(1, "Required")
    .min(8, "Password must be at least 8 characters"),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(1, "Required").min(8, "Password must be at least 8 characters"),
    confirm: z.string().min(1, "Required"),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export const otpSchema = z.object({
  code: z.string().length(6, "Enter the 6-digit code"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type OtpInputValues = z.infer<typeof otpSchema>;
