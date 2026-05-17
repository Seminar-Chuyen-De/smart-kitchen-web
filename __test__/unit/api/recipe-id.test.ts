import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PUT, DELETE } from "../../../app/api/recipes/[id]/route";
import * as clerk from "@clerk/nextjs/server";
import * as recipeService from "@/backend/services/recipe.service";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/backend/services/recipe.service", () => ({
  getRecipeById: vi.fn(),
  updateRecipe: vi.fn(),
  deleteRecipe: vi.fn(),
}));

describe("API /api/recipes/[id]", () => {
  const params = { params: { id: "1" } };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET should return recipe details", async () => {
    vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: "user_123" } as any);
    vi.mocked(recipeService.getRecipeById).mockResolvedValueOnce({ recipeId: 1, recipesName: "Recipe 1" } as any);
    
    const mockRequest = new Request("http://localhost/api/recipes/1");
    const response = await GET(mockRequest, params);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual({ recipeId: 1, recipesName: "Recipe 1" });
  });

  it("PUT should update recipe", async () => {
    vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: "user_123" } as any);
    const updateData = { recipesName: "Updated Name" };
    const mockRequest = new Request("http://localhost/api/recipes/1", {
      method: "PUT",
      body: JSON.stringify(updateData),
    });

    vi.mocked(recipeService.updateRecipe).mockResolvedValueOnce({ recipeId: 1, ...updateData } as any);
    
    const response = await PUT(mockRequest, params);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual({ recipeId: 1, ...updateData });
  });

  it("DELETE should delete recipe", async () => {
    vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: "user_123" } as any);
    vi.mocked(recipeService.deleteRecipe).mockResolvedValueOnce({ recipeId: 1 } as any);
    
    const mockRequest = new Request("http://localhost/api/recipes/1", { method: "DELETE" });
    const response = await DELETE(mockRequest, params);
    
    expect(response.status).toBe(200);
  });
});
