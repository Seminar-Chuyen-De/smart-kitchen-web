import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAllTags, createTag } from "@/backend/services/tag.service";
import { CreateTagSchema } from "@/backend/schemas/tag.schema";
import { handleAPIError } from "@/backend/middleware/error-handler";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(await getAllTags());
  } catch (error) { return handleAPIError(error); }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const data = CreateTagSchema.parse(await req.json());
    return NextResponse.json(await createTag(data), { status: 201 });
  } catch (error) { return handleAPIError(error); }
}
