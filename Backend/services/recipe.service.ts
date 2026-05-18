import { prisma } from "@/backend/db/client";
import type { CreateRecipeInput, UpdateRecipeInput } from "@/backend/schemas/recipe.schema";

// ================================
// GET ALL RECIPES (WITH FILTERS) của 1 user
// ================================
export async function searchRecipes(
  userId: string,
  query?: string,
  source?: string,
  cookbookId?: string
) {
  const where: any = { userId };

  if (query) {
    where.title = {
      contains: query,
      mode: "insensitive",
    };
  }

  if (source) {
    where.source = source;
  }

  if (cookbookId) {
    where.cookbookId = cookbookId;
  }

  return prisma.recipe.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { cookbook: { select: { id: true, title: true } } },
  });
}

export async function getRecipesByUser(userId: string) {
  return searchRecipes(userId);
}

// ================================
// GET SINGLE RECIPE
// ================================
export async function getRecipeById(id: string, userId: string) {
  return prisma.recipe.findFirst({
    where: { id, userId },
    include: { cookbook: true, scans: true },
  });
}

// ================================
// CREATE RECIPE
// ================================
export async function createRecipe(userId: string, data: CreateRecipeInput) {
  return prisma.recipe.create({
    data: {
      ...data,
      userId,
    },
  });
}

// ================================
// UPDATE RECIPE
// ================================
export async function updateRecipe(
  id: string,
  userId: string,
  data: UpdateRecipeInput
) {
  // Verify ownership trước khi update
  const existing = await prisma.recipe.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.recipe.update({
    where: { id },
    data,
  });
}

// ================================
// DELETE RECIPE
// ================================
export async function deleteRecipe(id: string, userId: string) {
  const existing = await prisma.recipe.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.recipe.delete({ where: { id } });
}
