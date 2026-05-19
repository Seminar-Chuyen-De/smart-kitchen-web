import { NextResponse } from "next/server";
import { upsertUser } from "@/backend/services/user.service";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { id, email_addresses, username, image_url } = payload.data;
    if (payload.type === "user.created" || payload.type === "user.updated") {
      await upsertUser({
        userId: id,
        email: email_addresses?.[0]?.email_address || "",
        username: username || "user",
        avatarUrl: image_url,
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
