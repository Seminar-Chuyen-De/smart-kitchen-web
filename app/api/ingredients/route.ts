import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAllIngredients, createIngredient } from "@/backend/services/ingredient.service";
import { CreateIngredientSchema } from "@/backend/schemas/ingredient.schema";
import { handleAPIError } from "@/backend/middleware/error-handler";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(await getAllIngredients());
  } catch (error) { return handleAPIError(error); }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const data = CreateIngredientSchema.parse(await req.json());
    return NextResponse.json(await createIngredient(data), { status: 201 });
  } catch (error) { return handleAPIError(error); }
}
