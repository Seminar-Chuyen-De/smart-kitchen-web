import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/backend/db/client";

/**
 * GET /api/recipes/debug
 * Endpoint tạm thời để debug dữ liệu trong DB.
 * XÓA ENDPOINT NÀY SAU KHI DEBUG XONG.
 */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const totalRecipes = await prisma.recipe.count({ where: { userId } });
    const totalSteps = await prisma.step.count({
      where: { recipe: { userId } }
    });
    const recipesWith0Steps = await prisma.recipe.count({
      where: { userId, steps: { none: {} } }
    });
    const recipesWith0Ingredients = await prisma.recipe.count({
      where: { userId, recipeIngredients: { none: {} } }
    });

    const latestRecipes = await prisma.recipe.findMany({
      where: { userId },
      include: {
        steps: { orderBy: { stepNumber: "asc" } },
        recipeIngredients: { include: { ingredient: true } },
      },
      take: 3,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      userId,
      summary: {
        totalRecipes,
        totalSteps,
        recipesWith0Steps,
        recipesWith0Ingredients,
        recipesWithSteps: totalRecipes - recipesWith0Steps,
      },
      latestRecipes: latestRecipes.map(r => ({
        recipeId: r.recipeId,
        name: r.recipesName,
        sourceType: r.sourceType,
        stepsCount: r.steps.length,
        ingredientsCount: r.recipeIngredients.length,
        steps: r.steps.map(s => ({ stepNumber: s.stepNumber, instruction: s.instruction.substring(0, 60) })),
        ingredients: r.recipeIngredients.map(ri => ri.ingredient.name),
      })),
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
