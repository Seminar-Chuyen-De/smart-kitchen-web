import { z } from "zod";

export const SourceTypeEnum = z.enum(["MANUAL", "IMPORTED", "AI_GENERATED"]);

// Schema cho RecipeIngredient
export const RecipeIngredientRelationSchema = z.object({
  ingredientId: z.number().int().positive(),
  quantity:     z.number().positive().nullish(),
  unit:         z.string().max(50).nullish(),
  note:         z.string().max(500).nullish(),
});

// Schema cho RecipeTag
export const RecipeTagRelationSchema = z.object({
  tagId: z.number().int().positive(),
});

// Schema cho Step của Recipe
export const RecipeStepRelationSchema = z.object({
  stepNumber:   z.number().int().positive(),
  instruction:  z.string().min(1, "Hướng dẫn không được để trống"),
  tip:          z.string().nullish(),
  time:         z.number().int().positive().nullish(),
});

export const RecipeSchema = z.object({
  recipeId:       z.number().int().positive().optional(),
  userId:         z.string().min(1, "User ID is required"),
  recipesName:    z.string().min(1, "Tên công thức không được để trống").max(200),
  description:    z.string().max(1000).nullish(),
  imageRecipe:    z.string().url("Đường dẫn ảnh không hợp lệ").nullish(),
  totalTime:      z.number().int().positive("Thời gian nấu phải là số dương").nullish(),
  calories:       z.number().positive().nullish(),
  protein:        z.number().positive().nullish(),
  carbs:          z.number().positive().nullish(),
  fats:           z.number().positive().nullish(),
  sourceType:     SourceTypeEnum.nullish().default("AI_GENERATED"),
  numberOfServes: z.number().int().positive().nullish(),
  createdAt:      z.date().optional(),
  updatedAt:      z.date().optional(),
});

export const CreateRecipeSchema = RecipeSchema.omit({
  recipeId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  // Có thể truyền kèm danh sách nguyên liệu, bước nấu và tag khi tạo
  ingredients: z.array(RecipeIngredientRelationSchema).optional(),
  steps:       z.array(RecipeStepRelationSchema).optional(),
  tags:        z.array(RecipeTagRelationSchema).optional(),
});

export const UpdateRecipeSchema = CreateRecipeSchema.omit({
  userId: true,
  sourceType: true,
}).partial();

export type RecipeInput = z.infer<typeof RecipeSchema>;
export type CreateRecipeInput = z.infer<typeof CreateRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof UpdateRecipeSchema>;
