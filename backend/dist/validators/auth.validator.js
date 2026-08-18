import { z } from "zod";
export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(128),
    firstName: z.string().min(2).max(100),
    lastName: z.string().max(100).optional()
});
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1).max(128)
});
