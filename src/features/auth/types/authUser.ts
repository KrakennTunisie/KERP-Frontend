import { z } from "zod";


export const authUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.email().optional(),
  roles: z.array(z.string()),
});

export const loginResponseSchema = z.object({
  user: authUserSchema,
});

export type AuthUser = z.infer<typeof authUserSchema>;

export type LoginResponse = z.infer<
  typeof loginResponseSchema
>;