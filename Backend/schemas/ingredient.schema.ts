import { z } from "zod";

export const CreateIngredientSchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
  bgColor: z.string().optional(),
});
export const UpdateIngredientSchema = CreateIngredientSchema.partial();
export type CreateIngredientInput = z.infer<typeof CreateIngredientSchema>;

export const CreateRecipeIngredientSchema = z.object({
  ingredientId: z.number().int(),
  quantity: z.number().positive().optional(),
  unit: z.string().optional(),
  note: z.string().optional(),
});
export type CreateRecipeIngredientInput = z.infer<typeof CreateRecipeIngredientSchema>;
