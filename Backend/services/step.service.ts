import { prisma } from "@/backend/db/client";
import type { CreateStepInput, UpdateStepInput } from "@/backend/schemas/step.schema";

export async function getStepsByRecipe(recipeId: number) {
  return prisma.step.findMany({
    where: { recipeId },
    orderBy: { stepNumber: 'asc' },
  });
}

export async function createStep(recipeId: number, userId: string, data: CreateStepInput) {
  const recipe = await prisma.recipe.findFirst({ where: { id: recipeId, userId } });
  if (!recipe) return null;
  return prisma.step.create({ data: { ...data, recipeId } });
}

export async function updateStep(stepId: number, recipeId: number, userId: string, data: UpdateStepInput) {
  const recipe = await prisma.recipe.findFirst({ where: { id: recipeId, userId } });
  if (!recipe) return null;
  return prisma.step.update({ where: { id: stepId }, data });
}

export async function deleteStep(stepId: number, recipeId: number, userId: string) {
  const recipe = await prisma.recipe.findFirst({ where: { id: recipeId, userId } });
  if (!recipe) return null;
  return prisma.step.delete({ where: { id: stepId } });
}
