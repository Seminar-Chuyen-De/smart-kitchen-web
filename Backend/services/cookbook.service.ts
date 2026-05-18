import { prisma } from "@/backend/db/client";
import type { CreateCookbookInput, UpdateCookbookInput } from "@/backend/schemas/cookbook.schema";

// ================================
// GET ALL COOKBOOKS của 1 user
// ================================
export async function getCookbooksByUser(userId: string) {
  return prisma.cookbook.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { recipes: true }
      }
    }
  });
}

// ================================
// GET SINGLE COOKBOOK (include recipes)
// ================================
export async function getCookbookById(id: string, userId: string) {
  return prisma.cookbook.findFirst({
    where: { id, userId },
    include: { recipes: true },
  });
}

// ================================
// CREATE COOKBOOK
// ================================
export async function createCookbook(userId: string, data: CreateCookbookInput) {
  return prisma.cookbook.create({
    data: {
      ...data,
      userId,
    },
  });
}

// ================================
// UPDATE COOKBOOK
// ================================
export async function updateCookbook(
  id: string,
  userId: string,
  data: UpdateCookbookInput
) {
  // Verify ownership trước khi update
  const existing = await prisma.cookbook.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.cookbook.update({
    where: { id },
    data,
  });
}

// ================================
// DELETE COOKBOOK
// ================================
export async function deleteCookbook(id: string, userId: string) {
  const existing = await prisma.cookbook.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.cookbook.delete({ where: { id } });
}

// ================================
// ADD RECIPE TO COOKBOOK
// ================================
export async function addRecipeToCookbook(cookbookId: string, recipeId: string, userId: string) {
  // Verify ownership của cookbook và recipe
  const [cookbook, recipe] = await Promise.all([
    prisma.cookbook.findFirst({ where: { id: cookbookId, userId } }),
    prisma.recipe.findFirst({ where: { id: recipeId, userId } })
  ]);

  if (!cookbook || !recipe) return null;

  return prisma.recipe.update({
    where: { id: recipeId },
    data: { cookbookId },
  });
}

// ================================
// REMOVE RECIPE FROM COOKBOOK
// ================================
export async function removeRecipeFromCookbook(cookbookId: string, recipeId: string, userId: string) {
  // Verify ownership của recipe, đồng thời kiểm tra nó có thuộc cookbook này không
  const recipe = await prisma.recipe.findFirst({
    where: { id: recipeId, userId, cookbookId }
  });

  if (!recipe) return null;

  return prisma.recipe.update({
    where: { id: recipeId },
    data: { cookbookId: null },
  });
}
