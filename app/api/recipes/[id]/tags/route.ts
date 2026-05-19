import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { addTagToRecipe } from "@/backend/services/tag.service";
import { AddRecipeTagSchema } from "@/backend/schemas/tag.schema";
import { handleAPIError } from "@/backend/middleware/error-handler";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const data = AddRecipeTagSchema.parse(await req.json());
    const result = await addTagToRecipe(Number(params.id), data.tagId, userId);
    if (!result) return NextResponse.json({ error: "Not Found or Unauthorized" }, { status: 404 });
    return NextResponse.json(result, { status: 201 });
  } catch (error) { return handleAPIError(error); }
}
