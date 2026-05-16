import { z } from "zod";

// ================================
// CREATE RECIPE
// ================================
export const CreateRecipeSchema = z.object({
  title:        z.string().min(1, "Tên công thức không được để trống").max(200),
  description:  z.string().max(1000).optional(),
  ingredients:  z.array(z.string().min(1)).min(1, "Cần ít nhất 1 nguyên liệu"),
  instructions: z.array(z.string().min(1)).min(1, "Cần ít nhất 1 bước"),
  cookTime:     z.number().int().positive().optional(),
  servings:     z.number().int().positive().optional(),
  imageUrl:     z.string().url().optional(),
  cookbookId:   z.string().cuid().optional(),
  source:       z.enum(["AI_GENERATED", "MANUAL", "IMPORTED"]).default("AI_GENERATED"),
});

// ================================
// UPDATE RECIPE
// ================================
export const UpdateRecipeSchema = CreateRecipeSchema.partial().omit({ source: true });

// ================================
// TYPES (inferred từ schema)
// ================================
export type CreateRecipeInput = z.infer<typeof CreateRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof UpdateRecipeSchema>;
