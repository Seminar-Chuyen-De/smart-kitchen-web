import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { addIngredientToRecipe } from "@/backend/services/ingredient.service";
import { CreateRecipeIngredientSchema } from "@/backend/schemas/ingredient.schema";
import { handleAPIError } from "@/backend/middleware/error-handler";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const data = CreateRecipeIngredientSchema.parse(await req.json());
    const result = await addIngredientToRecipe(Number(id), userId, data);
    if (!result) return NextResponse.json({ error: "Not Found or Unauthorized" }, { status: 404 });
    return NextResponse.json(result, { status: 201 });
  } catch (error) { return handleAPIError(error); }
}

