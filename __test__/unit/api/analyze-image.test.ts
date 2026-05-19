import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../../../app/api/ai/analyze-image/route";
import * as clerk from "@clerk/nextjs/server";
import * as orchestrator from "@/ai/agents/orchestrator.agent";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/ai/agents/orchestrator.agent", () => ({
  processImageToRecipe: vi.fn(),
}));

describe("API /api/ai/analyze-image", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POST should analyze image and return generated recipe", async () => {
    vi.mocked(clerk.auth).mockResolvedValueOnce({ userId: "user_123" } as any);
    
    const formData = new FormData();
    formData.append("file", new Blob(["dummy content"], { type: "image/png" }));
    
    const mockRequest = new Request("http://localhost/api/ai/analyze-image", {
      method: "POST",
      body: formData,
    });

    vi.mocked(orchestrator.processImageToRecipe).mockResolvedValueOnce({ recipeId: 99, message: "OK" });
    
    const response = await POST(mockRequest);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual({ recipeId: 99, message: "OK" });
  });
});
