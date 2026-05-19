import { vi, describe, it, expect, beforeEach } from "vitest";
import {
  createRecipe,
  deleteRecipe,
  getRecipesByUser,
  getRecipeById,
  updateRecipe
} from "../../../services/recipe.service";
import { prisma } from "../../../db/client";
import { CreateRecipeSchema } from "../../../schemas/recipe.schema";

vi.mock("../../../db/client", () => ({
  prisma: {
    recipe: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    user: {
      delete: vi.fn(),
    }
  }
}));

describe("Recipe Service & Database Schema Test Cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // TEST CASE 1: CREATE RECIPE WITH NESTED RELATIONS
  // ==========================================
  it("TC1: Should successfully create a recipe with nested relations (Steps, Ingredients, Tags)", async () => {
    const mockInput = {
      recipesName: "Cơm chiên trứng",
      description: "Ngon bổ rẻ",
      totalTime: 15,
      steps: [
        { stepNumber: 1, instruction: "Đập trứng", time: 1 }
      ],
      ingredients: [
        { ingredientId: 1, quantity: 2, unit: "quả" }
      ],
      tags: [
        { tagId: 2 }
      ]
    };

    const mockCreatedRecipe = {
      recipeId: 1,
      userId: "user_test_123",
      recipesName: "Cơm chiên trứng",
      description: "Ngon bổ rẻ",
      totalTime: 15,
      steps: [{ stepId: 1, stepNumber: 1, instruction: "Đập trứng", time: 1 }],
      recipeIngredients: [{ recipeId: 1, ingredientId: 1, quantity: 2, unit: "quả" }],
      recipeTags: [{ recipeId: 1, tagId: 2 }]
    };

    vi.mocked(prisma.recipe.create).mockResolvedValue(mockCreatedRecipe as any);

    const result = await createRecipe("user_test_123", mockInput as any);

    expect(prisma.recipe.create).toHaveBeenCalledWith({
      data: {
        recipesName: "Cơm chiên trứng",
        description: "Ngon bổ rẻ",
        totalTime: 15,
        userId: "user_test_123",
        steps: {
          create: [
            { stepNumber: 1, instruction: "Đập trứng", tip: undefined, time: 1 }
          ]
        },
        recipeIngredients: {
          create: [
            { ingredientId: 1, quantity: 2, unit: "quả", note: undefined }
          ]
        },
        recipeTags: {
          create: [
            { tagId: 2 }
          ]
        }
      },
      include: {
        steps: { orderBy: { stepNumber: "asc" } },
        recipeIngredients: { include: { ingredient: true } },
        recipeTags: { include: { tag: true } }
      }
    });
    expect(result).toEqual(mockCreatedRecipe);
  });

  // ==========================================
  // TEST CASE 2: EAGER LOAD RELATIONS ON READ
  // ==========================================
  it("TC2: Should eagerly load steps, ingredients, tags and cookbooks when getting user recipes", async () => {
    const mockRecipes = [
      {
        recipeId: 1,
        recipesName: "Cơm chiên",
        steps: [],
        recipeIngredients: [],
        recipeTags: [],
        cookbookRecipes: []
      }
    ];

    vi.mocked(prisma.recipe.findMany).mockResolvedValue(mockRecipes as any);

    const result = await getRecipesByUser("user_test_123");

    expect(prisma.recipe.findMany).toHaveBeenCalledWith({
      where: { userId: "user_test_123" },
      orderBy: { createdAt: "desc" },
      include: {
        steps: { orderBy: { stepNumber: "asc" } },
        recipeIngredients: { include: { ingredient: true } },
        recipeTags: { include: { tag: true } },
        cookbookRecipes: { include: { cookbook: true } }
      }
    });
    expect(result).toEqual(mockRecipes);
  });

  // ==========================================
  // TEST CASE 3: ZOD VALIDATION RULES
  // ==========================================
  it("TC3: Should validate Recipe creation schema correctly and throw error on empty name", () => {
    const invalidInput = {
      recipesName: "", // Empty name (should trigger validation error)
      userId: "user_test_123"
    };

    const result = CreateRecipeSchema.safeParse(invalidInput);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe("Tên công thức không được để trống");
    }
  });

  // ==========================================
  // TEST CASE 4: CASCADE DELETE / DELETE BEHAVIOR
  // ==========================================
  it("TC4: Should delete recipe successfully when existing", async () => {
    const mockRecipe = { recipeId: 1, userId: "user_test_123" };
    vi.mocked(prisma.recipe.findFirst).mockResolvedValue(mockRecipe as any);
    vi.mocked(prisma.recipe.delete).mockResolvedValue(mockRecipe as any);

    const result = await deleteRecipe(1, "user_test_123");

    expect(prisma.recipe.findFirst).toHaveBeenCalledWith({
      where: { recipeId: 1, userId: "user_test_123" }
    });
    expect(prisma.recipe.delete).toHaveBeenCalledWith({
      where: { recipeId: 1 }
    });
    expect(result).toEqual(mockRecipe);
  });

  // ==========================================
  // TEST CASE 5: OWNERSHIP BOUNDARY & ERROR HANDLINGS
  // ==========================================
  it("TC5: Should return null when updating a recipe that does not belong to the user or does not exist", async () => {
    vi.mocked(prisma.recipe.findFirst).mockResolvedValue(null);

    const result = await updateRecipe(999, "user_test_123", { recipesName: "New Name" });

    expect(prisma.recipe.findFirst).toHaveBeenCalledWith({
      where: { recipeId: 999, userId: "user_test_123" }
    });
    expect(prisma.recipe.update).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
