import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PUT, DELETE } from "../../../app/api/cookbooks/[id]/route";
import * as clerk from "@clerk/nextjs/server";
import * as cookbookService from "@/backend/services/cookbook.service";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/backend/services/cookbook.service", () => ({
  getCookbookById: vi.fn(),
  updateCookbook: vi.fn(),
  deleteCookbook: vi.fn(),
}));

describe("API /api/cookbooks/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockParams = { params: { id: "cookbook_1" } };
  const mockRequest = new Request("http://localhost/api/cookbooks/cookbook_1");

  it("GET should return 401 if not authenticated", async () => {
    vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: null } as any);
    const response = await GET(mockRequest, mockParams);
    expect(response.status).toBe(401);
  });

  it("GET should return 404 if cookbook not found", async () => {
    vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: "user_1" } as any);
    vi.mocked(cookbookService.getCookbookById).mockResolvedValueOnce(null);
    const response = await GET(mockRequest, mockParams);
    expect(response.status).toBe(404);
  });

  it("GET should return cookbook details", async () => {
    vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: "user_1" } as any);
    vi.mocked(cookbookService.getCookbookById).mockResolvedValueOnce({ id: "cookbook_1", title: "My Cookbook" } as any);
    
    const response = await GET(mockRequest, mockParams);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: "cookbook_1", title: "My Cookbook" });
  });

  it("PUT should update cookbook", async () => {
    vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: "user_1" } as any);
    const updateData = { title: "Updated Title" };
    const putRequest = new Request("http://localhost/api/cookbooks/cookbook_1", {
      method: "PUT",
      body: JSON.stringify(updateData),
    });

    vi.mocked(cookbookService.updateCookbook).mockResolvedValueOnce({ id: "cookbook_1", title: "Updated Title" } as any);
    
    const response = await PUT(putRequest, mockParams);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: "cookbook_1", title: "Updated Title" });
  });

  it("DELETE should remove cookbook", async () => {
    vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: "user_1" } as any);
    vi.mocked(cookbookService.deleteCookbook).mockResolvedValueOnce({ id: "cookbook_1" } as any);
    
    const response = await DELETE(mockRequest, mockParams);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
  });
});
