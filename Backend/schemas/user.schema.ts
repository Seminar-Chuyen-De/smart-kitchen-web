import { z } from "zod";

export const CreateUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
});

export const UpdateUserSchema = CreateUserSchema.partial().omit({ id: true });

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
