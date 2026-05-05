// src/modules/auth/auth.schema.ts
import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"),
  password: z.string().min(1, "Password is required"),
});
