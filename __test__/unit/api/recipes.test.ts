import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../../../app/api/recipes/route";
import * as clerk from "@clerk/nextjs/server";
import * as recipeService from "@/backend/services/recipe.service";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/backend/services/recipe.service", () => ({
  searchRecipes: vi.fn(),
  getRecipesByUser: vi.fn(),
  createRecipe: vi.fn(),
}));

describe("API /api/recipes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET should return 401 if not authenticated", async () => {
    vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: null } as any);
    const mockRequest = { nextUrl: { searchParams: new URLSearchParams() } } as any;
    const response = await GET(mockRequest);
    expect(response.status).toBe(401);
  });

  it("GET should return recipes if authenticated", async () => {
    vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: "user_123" } as any);
    vi.mocked(recipeService.searchRecipes).mockResolvedValueOnce([{ id: 1, recipesName: "Recipe 1" }] as any);
    
    const mockRequest = { nextUrl: { searchParams: new URLSearchParams() } } as any;
    const response = await GET(mockRequest);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual([{ id: 1, recipesName: "Recipe 1" }]);
  });

  it("POST should create recipe", async () => {
    vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: "user_123" } as any);
    const newRecipe = { 
      title: "New Recipe", 
      ingredients: ["ing1", "ing2"], 
      instructions: ["step1", "step2"], 
      source: "MANUAL" 
    };
    const mockRequest = new Request("http://localhost/api/recipes", {
      method: "POST",
      body: JSON.stringify(newRecipe),
    });

    vi.mocked(recipeService.createRecipe).mockResolvedValueOnce({ id: 2, ...newRecipe } as any);
    
    const response = await POST(mockRequest);
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data).toEqual({ id: 2, ...newRecipe });
  });

  it("POST should return 400 on validation error", async () => {
    vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: "user_123" } as any);
    const invalidRecipe = { sourceType: "MANUAL" }; // Missing recipesName
    const mockRequest = new Request("http://localhost/api/recipes", {
      method: "POST",
      body: JSON.stringify(invalidRecipe),
    });

    const response = await POST(mockRequest);
    expect(response.status).toBe(400);
  });
});
