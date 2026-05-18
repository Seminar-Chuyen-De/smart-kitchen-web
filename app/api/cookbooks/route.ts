import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCookbooksByUser, createCookbook } from "@/backend/services/cookbook.service";
import { CreateCookbookSchema } from "@/backend/schemas/cookbook.schema";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(await getCookbooksByUser(userId));
  } catch (error) { return NextResponse.json({ error: "Server Error" }, { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const data = CreateCookbookSchema.parse(body);
    return NextResponse.json(await createCookbook(userId, data), { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.name === "ZodError" ? error.errors : "Server Error" },
      { status: error?.name === "ZodError" ? 400 : 500 }
    );
  }
}
