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
    include: {
      steps: {
        orderBy: { stepNumber: "asc" }
      },
      recipeIngredients: {
        include: {
          ingredient: true
        }
      },
      recipeTags: {
        include: {
          tag: true
        }
      },
      cookbookRecipes: {
        include: {
          cookbook: true
        }
      }
    }
  });
}

export async function getRecipesByUser(userId: string) {
  return searchRecipes(userId);
}

// ================================
// GET SINGLE RECIPE
// ================================
export async function getRecipeById(recipeId: number, userId: string) {
  return prisma.recipe.findFirst({
    where: { recipeId, userId },
    include: {
      steps: {
        orderBy: { stepNumber: "asc" }
      },
      recipeIngredients: {
        include: {
          ingredient: true
        }
      },
      recipeTags: {
        include: {
          tag: true
        }
      },
      cookbookRecipes: {
        include: {
          cookbook: true
        }
      },
      scans: true
    }
  });
}

// ================================
// CREATE RECIPE
// ================================
export async function createRecipe(userId: string, data: CreateRecipeInput) {
  const { ingredients, steps, tags, ...recipeData } = data;

  return prisma.recipe.create({
    data: {
      ...recipeData,
      userId,
      steps: steps ? {
        create: steps.map(s => ({
          stepNumber:  s.stepNumber,
          instruction: s.instruction,
          tip:         s.tip,
          time:        s.time,
        }))
      } : undefined,
      recipeIngredients: ingredients ? {
        create: ingredients.map(i => ({
          ingredientId: i.ingredientId,
          quantity:     i.quantity,
          unit:         i.unit,
          note:         i.note,
        }))
      } : undefined,
      recipeTags: tags ? {
        create: tags.map(t => ({
          tagId: t.tagId,
        }))
      } : undefined,
    },
    include: {
      steps: { orderBy: { stepNumber: "asc" } },
      recipeIngredients: { include: { ingredient: true } },
      recipeTags: { include: { tag: true } }
    }
  });
}

// ================================
// UPDATE RECIPE
// ================================
export async function updateRecipe(
  recipeId: number,
  userId: string,
  data: UpdateRecipeInput
) {
  // Verify ownership trước khi update
  const existing = await prisma.recipe.findFirst({ where: { recipeId, userId } });
  if (!existing) return null;

  const { ingredients, steps, tags, ...recipeData } = data;

  return prisma.recipe.update({
    where: { recipeId },
    data: {
      ...recipeData,
      steps: steps ? {
        deleteMany: {},
        create: steps.map(s => ({
          stepNumber:  s.stepNumber,
          instruction: s.instruction,
          tip:         s.tip,
          time:        s.time,
        }))
      } : undefined,
      recipeIngredients: ingredients ? {
        deleteMany: {},
        create: ingredients.map(i => ({
          ingredientId: i.ingredientId,
          quantity:     i.quantity,
          unit:         i.unit,
          note:         i.note,
        }))
      } : undefined,
      recipeTags: tags ? {
        deleteMany: {},
        create: tags.map(t => ({
          tagId: t.tagId,
        }))
      } : undefined,
    },
    include: {
      steps: { orderBy: { stepNumber: "asc" } },
      recipeIngredients: { include: { ingredient: true } },
      recipeTags: { include: { tag: true } }
    }
  });
}

// ================================
// DELETE RECIPE
// ================================
export async function deleteRecipe(recipeId: number, userId: string) {
  const existing = await prisma.recipe.findFirst({ where: { recipeId, userId } });
  if (!existing) return null;

  return prisma.recipe.delete({ where: { recipeId } });
}
