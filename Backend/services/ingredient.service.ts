import { prisma } from "@/backend/db/client";
import type { CreateIngredientInput, CreateRecipeIngredientInput } from "@/backend/schemas/ingredient.schema";

export async function getAllIngredients() {
  return prisma.ingredient.findMany({ orderBy: { name: 'asc' } });
}
export async function createIngredient(data: CreateIngredientInput) {
  return prisma.ingredient.create({ data });
}

// Recipe Ingredients
export async function addIngredientToRecipe(recipeId: number, userId: string, data: CreateRecipeIngredientInput) {
  const recipe = await prisma.recipe.findFirst({ where: { recipeId, userId } });
  if (!recipe) return null;
  return prisma.recipeIngredient.create({ data: { ...data, recipeId } });
}
export async function removeIngredientFromRecipe(recipeId: number, ingredientId: number, userId: string) {
  const recipe = await prisma.recipe.findFirst({ where: { recipeId, userId } });
  if (!recipe) return null;
  return prisma.recipeIngredient.delete({ where: { recipeId_ingredientId: { recipeId, ingredientId } } });
}
