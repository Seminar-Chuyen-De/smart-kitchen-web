import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST, DELETE } from "../../../app/api/cookbooks/[id]/recipes/route";
import * as clerk from "@clerk/nextjs/server";
import * as cookbookService from "@/backend/services/cookbook.service";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/backend/services/cookbook.service", () => ({
  addRecipeToCookbook: vi.fn(),
  removeRecipeFromCookbook: vi.fn(),
}));

describe("API /api/cookbooks/[id]/recipes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockParams = { params: { id: "cookbook_1" } };

  it("POST should add recipe to cookbook", async () => {
    vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: "user_1" } as any);
    const postRequest = new Request("http://localhost/api/cookbooks/cookbook_1/recipes", {
      method: "POST",
      body: JSON.stringify({ recipeId: "recipe_1" }),
    });

    vi.mocked(cookbookService.addRecipeToCookbook).mockResolvedValueOnce({ id: "recipe_1", cookbookId: "cookbook_1" } as any);
    
    const response = await POST(postRequest, mockParams);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: "recipe_1", cookbookId: "cookbook_1" });
  });

  it("POST should return 400 if recipeId is missing", async () => {
    vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: "user_1" } as any);
    const postRequest = new Request("http://localhost/api/cookbooks/cookbook_1/recipes", {
      method: "POST",
      body: JSON.stringify({}),
    });
    
    const response = await POST(postRequest, mockParams);
    expect(response.status).toBe(400);
  });

  it("DELETE should remove recipe from cookbook (via body)", async () => {
    vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: "user_1" } as any);
    const deleteRequest = new Request("http://localhost/api/cookbooks/cookbook_1/recipes", {
      method: "DELETE",
      body: JSON.stringify({ recipeId: "recipe_1" }),
    });

    vi.mocked(cookbookService.removeRecipeFromCookbook).mockResolvedValueOnce({ id: "recipe_1", cookbookId: null } as any);
    
    const response = await DELETE(deleteRequest, mockParams);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
  });

  it("DELETE should remove recipe from cookbook (via searchParams)", async () => {
    vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: "user_1" } as any);
    const deleteRequest = new Request("http://localhost/api/cookbooks/cookbook_1/recipes?recipeId=recipe_1", {
      method: "DELETE",
    });

    vi.mocked(cookbookService.removeRecipeFromCookbook).mockResolvedValueOnce({ id: "recipe_1", cookbookId: null } as any);
    
    const response = await DELETE(deleteRequest, mockParams);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
  });
});
