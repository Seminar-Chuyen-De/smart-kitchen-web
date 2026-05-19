import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../../../app/api/webhooks/clerk/route";
import * as userService from "@/backend/services/user.service";

vi.mock("@/backend/services/user.service", () => ({
  upsertUser: vi.fn(),
}));

describe("API /api/webhooks/clerk", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POST should sync user data on user.created event", async () => {
    const payload = {
      type: "user.created",
      data: {
        id: "user_123",
        email_addresses: [{ email_address: "test@example.com" }],
        username: "testuser",
        image_url: "http://example.com/avatar.jpg",
      },
    };

    const mockRequest = new Request("http://localhost/api/webhooks/clerk", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    vi.mocked(userService.upsertUser).mockResolvedValueOnce({} as any);

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(userService.upsertUser).toHaveBeenCalledWith({
      userId: "user_123",
      email: "test@example.com",
      username: "testuser",
      avatarUrl: "http://example.com/avatar.jpg",
    });
  });
});
