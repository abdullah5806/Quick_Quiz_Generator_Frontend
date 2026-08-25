import {z} from "zod";

export const loginSchema = z.object({
    email: z
    .string()
    .trim()
    .email("Invalid Email Address"),

    password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password cannot exceed 32 characters")
});