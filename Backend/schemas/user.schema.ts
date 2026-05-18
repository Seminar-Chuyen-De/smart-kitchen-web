import { z } from "zod";

export const UserSchema = z.object({
  userId: z.string().min(1, "Clerk User ID is required"),
  email: z.string().email("Invalid email format"),
  username: z.string().min(1, "Username cannot be empty").max(100),
  avatarUrl: z.string().url("Invalid avatar URL format").nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateUserSchema = UserSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const UpdateUserSchema = UserSchema.omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export type UserInput = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
