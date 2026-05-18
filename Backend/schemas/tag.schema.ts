import { z } from "zod";

export const TagSchema = z.object({
  tagId: z.number().int().positive().optional(),
  name: z.string().min(1, "Tag name cannot be empty").max(50),
  category: z.string().max(50).nullish(),
  emoji: z.string().max(10).nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateTagSchema = TagSchema.omit({
  tagId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateTagSchema = CreateTagSchema.partial();

export type TagInput = z.infer<typeof TagSchema>;
export type CreateTagInput = z.infer<typeof CreateTagSchema>;
export type UpdateTagInput = z.infer<typeof UpdateTagSchema>;
