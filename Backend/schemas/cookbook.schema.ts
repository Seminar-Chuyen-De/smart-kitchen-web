import { z } from "zod";

export const CookbookSchema = z.object({
  cookbookId: z.number().int().positive().optional(),
  userId: z.string().min(1, "User ID is required"),
  name: z.string().min(1, "Cookbook name cannot be empty").max(100),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateCookbookSchema = CookbookSchema.omit({
  cookbookId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateCookbookSchema = CookbookSchema.omit({
  cookbookId: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export type CookbookInput = z.infer<typeof CookbookSchema>;
export type CreateCookbookInput = z.infer<typeof CreateCookbookSchema>;
export type UpdateCookbookInput = z.infer<typeof UpdateCookbookSchema>;
