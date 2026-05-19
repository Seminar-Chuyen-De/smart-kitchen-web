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
        select: { cookbookRecipes: true }
      }
    }
  });
}

// ================================
// GET SINGLE COOKBOOK (include recipes)
// ================================
export async function getCookbookById(cookbookId: number, userId: string) {
  return prisma.cookbook.findFirst({
    where: { cookbookId, userId },
    include: {
      cookbookRecipes: {
        include: { recipe: true }
      }
    },
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
  cookbookId: number,
  userId: string,
  data: UpdateCookbookInput
) {
  const existing = await prisma.cookbook.findFirst({ where: { cookbookId, userId } });
  if (!existing) return null;

  return prisma.cookbook.update({
    where: { cookbookId },
    data,
  });
}

// ================================
// DELETE COOKBOOK
// ================================
export async function deleteCookbook(cookbookId: number, userId: string) {
  const existing = await prisma.cookbook.findFirst({ where: { cookbookId, userId } });
  if (!existing) return null;

  return prisma.cookbook.delete({ where: { cookbookId } });
}

// ================================
// ADD RECIPE TO COOKBOOK (qua junction table CookbookRecipe)
// ================================
export async function addRecipeToCookbook(cookbookId: number, recipeId: number, userId: string) {
  const [cookbook, recipe] = await Promise.all([
    prisma.cookbook.findFirst({ where: { cookbookId, userId } }),
    prisma.recipe.findFirst({ where: { recipeId, userId } })
  ]);

  if (!cookbook || !recipe) return null;

  return prisma.cookbookRecipe.create({
    data: { cookbookId, recipeId },
  });
}

// ================================
// REMOVE RECIPE FROM COOKBOOK
// ================================
export async function removeRecipeFromCookbook(cookbookId: number, recipeId: number, userId: string) {
  const cookbook = await prisma.cookbook.findFirst({ where: { cookbookId, userId } });
  if (!cookbook) return null;

  return prisma.cookbookRecipe.delete({
    where: { recipeId_cookbookId: { recipeId, cookbookId } },
  });
}
