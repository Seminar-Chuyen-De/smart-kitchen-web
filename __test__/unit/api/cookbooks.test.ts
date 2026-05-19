import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../../../app/api/cookbooks/route";
import * as clerk from "@clerk/nextjs/server";
import * as cookbookService from "@/backend/services/cookbook.service";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/backend/services/cookbook.service", () => ({
  getCookbooksByUser: vi.fn(),
  createCookbook: vi.fn(),
}));

describe("API /api/cookbooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET should return 401 if not authenticated", async () => {
    vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: null } as any);
    const response = await GET();
    expect(response.status).toBe(401);
  });

  it("GET should return cookbooks if authenticated", async () => {
    vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: "user_123" } as any);
    vi.mocked(cookbookService.getCookbooksByUser).mockResolvedValueOnce([{ id: "1", title: "My Cookbook" }] as any);
    
    const response = await GET();
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual([{ id: "1", title: "My Cookbook" }]);
  });

  it("POST should create cookbook", async () => {
    vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: "user_123" } as any);
    const newCookbook = { title: "New Cookbook", description: "Test" };
    const mockRequest = new Request("http://localhost/api/cookbooks", {
      method: "POST",
      body: JSON.stringify(newCookbook),
    });

    vi.mocked(cookbookService.createCookbook).mockResolvedValueOnce({ id: "2", ...newCookbook } as any);
    
    const response = await POST(mockRequest);
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data).toEqual({ id: "2", ...newCookbook });
  });

  it("POST should return 400 on validation error", async () => {
    vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: "user_123" } as any);
    const invalidCookbook = { description: "Missing title" };
    const mockRequest = new Request("http://localhost/api/cookbooks", {
      method: "POST",
      body: JSON.stringify(invalidCookbook),
    });

    const response = await POST(mockRequest);
    expect(response.status).toBe(400);
  });
});
