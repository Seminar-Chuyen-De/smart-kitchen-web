import { z } from "zod";

export const CreateTagSchema = z.object({
  name: z.string().min(1),
  category: z.string().optional(),
  emoji: z.string().optional(),
});
export type CreateTagInput = z.infer<typeof CreateTagSchema>;

export const AddRecipeTagSchema = z.object({
  tagId: z.number().int(),
});
