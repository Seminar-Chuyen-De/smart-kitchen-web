import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PUT } from "../../../app/api/user/profile/route";
import * as clerk from "@clerk/nextjs/server";
import * as userService from "@/backend/services/user.service";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/backend/services/user.service", () => ({
  getUserById: vi.fn(),
  updateUser: vi.fn(),
}));

describe("API /api/user/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    it("should return 401 if not authenticated", async () => {
      vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: null } as any);
      const response = await GET();
      expect(response.status).toBe(401);
    });

    it("should return 404 if user not found", async () => {
      vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: "user_123" } as any);
      vi.mocked(userService.getUserById).mockResolvedValueOnce(null);
      
      const response = await GET();
      expect(response.status).toBe(404);
    });

    it("should return user profile if authenticated and found", async () => {
      const mockUser = { id: "user_123", email: "test@example.com", name: "Test User", avatarUrl: null, createdAt: new Date(), updatedAt: new Date() };
      vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: "user_123" } as any);
      vi.mocked(userService.getUserById).mockResolvedValueOnce(mockUser as any);
      
      const response = await GET();
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.email).toBe("test@example.com");
    });
  });

  describe("PUT", () => {
    it("should return 401 if not authenticated", async () => {
      vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: null } as any);
      const mockRequest = new Request("http://localhost", { method: "PUT", body: "{}" });
      const response = await PUT(mockRequest as any);
      expect(response.status).toBe(401);
    });

    it("should return 400 if validation fails", async () => {
      vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: "user_123" } as any);
      const mockRequest = new Request("http://localhost", { 
        method: "PUT", 
        body: JSON.stringify({ email: "not-an-email" }) 
      });
      const response = await PUT(mockRequest as any);
      expect(response.status).toBe(400);
    });

    it("should update and return user profile", async () => {
      vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: "user_123" } as any);
      const updateData = { name: "Updated Name" };
      const mockRequest = new Request("http://localhost", { 
        method: "PUT", 
        body: JSON.stringify(updateData) 
      });

      const updatedUser = { id: "user_123", email: "test@example.com", name: "Updated Name", avatarUrl: null };
      vi.mocked(userService.updateUser).mockResolvedValueOnce(updatedUser as any);
      
      const response = await PUT(mockRequest as any);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.name).toBe("Updated Name");
    });
  });
});
