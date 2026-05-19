import { z } from "zod";

export const IngredientSchema = z.object({
  ingredientId: z.number().int().positive().optional(),
  name: z.string().min(1, "Ingredient name cannot be empty").max(100),
  icon: z.string().max(50).nullish(),
  bgColor: z.string().max(20).nullish().default("#F5F5F5"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateIngredientSchema = IngredientSchema.omit({
  ingredientId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateIngredientSchema = CreateIngredientSchema.partial();

// Schema cho junction table RecipeIngredient
export const CreateRecipeIngredientSchema = z.object({
  ingredientId: z.number().int().positive(),
  quantity: z.number().positive().optional(),
  unit: z.string().max(50).optional(),
  note: z.string().optional(),
});

export const UpdateRecipeIngredientSchema = CreateRecipeIngredientSchema.omit({
  ingredientId: true,
}).partial();

export type IngredientInput = z.infer<typeof IngredientSchema>;
export type CreateIngredientInput = z.infer<typeof CreateIngredientSchema>;
export type UpdateIngredientInput = z.infer<typeof UpdateIngredientSchema>;
export type CreateRecipeIngredientInput = z.infer<typeof CreateRecipeIngredientSchema>;
export type UpdateRecipeIngredientInput = z.infer<typeof UpdateRecipeIngredientSchema>;
