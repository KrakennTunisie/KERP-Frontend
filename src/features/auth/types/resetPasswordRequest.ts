import { z } from "zod";


export const forgotPasswordRequestSchema =
    z.object({
        email: z
            .string()
            .min(1, "Email is required")
            .email("addresse mail invalide"),
    });

export type ForgotPasswordRequest =
    z.infer<
        typeof forgotPasswordRequestSchema

    >;


export const verifyOtpRequestSchema =
    z.object({
        email: z
            .string()
            .min(1, "Email is required")
            .email("Invalid email address"),

        otp: z
            .string()
            .min(1, "OTP is required")
            .regex(
                /^\d{6}$/,
                "OTP must be 6 digits"
            ),
    });

export type VerifyOtpRequest =
    z.infer<
        typeof verifyOtpRequestSchema

    >;


export const resetPasswordRequestSchema =
    z
        .object({
            resetToken: z
                .string()
                .min(1, "Reset token is required"),

            newPassword: z
                .string()
                .min(
                    8,
                    "Password must be at least 8 characters"
                ),

            confirmPassword: z
                .string()
                .min(
                    1,
                    "Password confirmation is required"
                ),
        })
        .refine(
            (data) =>
                data.newPassword ===
                data.confirmPassword,
            {
                message:
                    "Passwords do not match",
                path: ["confirmPassword"],
            }
        );

export type ResetPasswordRequest =
    z.infer<
        typeof resetPasswordRequestSchema

    >;

export const verifyOtpResponseSchema =
    z.object({
        resetToken: z.string(),
    });

export type VerifyOtpResponse =
    z.infer<
        typeof verifyOtpResponseSchema

    >;
