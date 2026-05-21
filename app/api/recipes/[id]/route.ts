import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getRecipeById, updateRecipe, deleteRecipe } from "@/backend/services/recipe.service";
import { UpdateRecipeSchema } from "@/backend/schemas/recipe.schema";
import { mapRecipeToFrontend } from "@/backend/utils/recipe-mapper";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const recipe = await getRecipeById(Number(id), userId);
    if (!recipe) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(mapRecipeToFrontend(recipe));
  } catch (e) { 
    console.error("GET recipe details error:", e);
    return NextResponse.json({ error: "Server Error" }, { status: 500 }); 
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const data = UpdateRecipeSchema.parse(await req.json());
    await updateRecipe(Number(id), userId, data);
    
    // Lấy lại recipe đầy đủ các bảng liên kết để trả về đúng cấu trúc Frontend
    const fullRecipe = await getRecipeById(Number(id), userId);
    return NextResponse.json(mapRecipeToFrontend(fullRecipe));
  } catch (e: any) { 
    console.error("PUT recipe details error:", e);
    return NextResponse.json({ error: e?.name === "ZodError" ? e.errors : "Server Error" }, { status: e?.name === "ZodError" ? 400 : 500 }); 
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    return NextResponse.json(await deleteRecipe(Number(id), userId));
  } catch (e) { return NextResponse.json({ error: "Server Error" }, { status: 500 }); }
}

