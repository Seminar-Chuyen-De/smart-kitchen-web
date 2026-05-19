import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getRecipeById, updateRecipe, deleteRecipe } from "@/backend/services/recipe.service";
import { UpdateRecipeSchema } from "@/backend/schemas/recipe.schema";
import { mapRecipeToFrontend } from "@/backend/utils/recipe-mapper";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const recipe = await getRecipeById(Number(params.id), userId);
    return NextResponse.json(mapRecipeToFrontend(recipe));
  } catch (e) { 
    console.error("GET recipe details error:", e);
    return NextResponse.json({ error: "Server Error" }, { status: 500 }); 
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const data = UpdateRecipeSchema.parse(await req.json());
    const updated = await updateRecipe(Number(params.id), userId, data);
    
    // Lấy lại recipe đầy đủ các bảng liên kết để trả về đúng cấu trúc Frontend
    const fullRecipe = await getRecipeById(Number(params.id), userId);
    return NextResponse.json(mapRecipeToFrontend(fullRecipe));
  } catch (e: any) { 
    console.error("PUT recipe details error:", e);
    return NextResponse.json({ error: e?.name === "ZodError" ? e.errors : "Server Error" }, { status: e?.name === "ZodError" ? 400 : 500 }); 
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(await deleteRecipe(Number(params.id), userId));
  } catch (e) { return NextResponse.json({ error: "Server Error" }, { status: 500 }); }
}
