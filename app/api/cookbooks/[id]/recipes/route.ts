import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { addRecipeToCookbook, removeRecipeFromCookbook } from "@/backend/services/cookbook.service";

// Thêm recipe vào cookbook
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const { recipeId } = body;
    
    if (!recipeId) return NextResponse.json({ error: "recipeId is required" }, { status: 400 });

    const result = await addRecipeToCookbook(params.id, recipeId, userId);
    if (!result) return NextResponse.json({ error: "Not Found or Unauthorized" }, { status: 404 });
    
    return NextResponse.json(result);
  } catch (e) { return NextResponse.json({ error: "Server Error" }, { status: 500 }); }
}

// Xóa recipe khỏi cookbook
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    let recipeId: string | null = null;
    
    try {
      const body = await req.json();
      recipeId = body.recipeId;
    } catch {
      const url = new URL(req.url);
      recipeId = url.searchParams.get("recipeId");
    }

    if (!recipeId) return NextResponse.json({ error: "recipeId is required" }, { status: 400 });

    const result = await removeRecipeFromCookbook(params.id, recipeId, userId);
    if (!result) return NextResponse.json({ error: "Not Found or Unauthorized" }, { status: 404 });
    
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ error: "Server Error" }, { status: 500 }); }
}
