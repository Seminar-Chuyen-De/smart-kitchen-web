import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { removeTagFromRecipe } from "@/backend/services/tag.service";
import { handleAPIError } from "@/backend/middleware/error-handler";

export async function DELETE(req: Request, { params }: { params: { id: string, tagId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const result = await removeTagFromRecipe(Number(params.id), Number(params.tagId), userId);
    if (!result) return NextResponse.json({ error: "Not Found or Unauthorized" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) { return handleAPIError(error); }
}
