import { prisma } from "@/backend/db/client";
import type { CreateTagInput } from "@/backend/schemas/tag.schema";

export async function getAllTags() {
  return prisma.tag.findMany({ orderBy: { name: 'asc' } });
}
export async function createTag(data: CreateTagInput) {
  return prisma.tag.create({ data });
}
export async function addTagToRecipe(recipeId: number, tagId: number, userId: string) {
  const recipe = await prisma.recipe.findFirst({ where: { recipeId, userId } });
  if (!recipe) return null;
  return prisma.recipeTag.create({ data: { recipeId, tagId } });
}
export async function removeTagFromRecipe(recipeId: number, tagId: number, userId: string) {
  const recipe = await prisma.recipe.findFirst({ where: { recipeId, userId } });
  if (!recipe) return null;
  return prisma.recipeTag.delete({ where: { recipeId_tagId: { recipeId, tagId } } });
}
