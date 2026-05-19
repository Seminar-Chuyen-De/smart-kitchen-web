import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getRecipesByUser, createRecipe } from "@/backend/services/recipe.service";
import { CreateRecipeSchema } from "@/backend/schemas/recipe.schema";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(await getRecipesByUser(userId));
  } catch (error) { return NextResponse.json({ error: "Server Error" }, { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    body.userId = userId;
    const data = CreateRecipeSchema.parse(body);
    return NextResponse.json(await createRecipe(userId, data), { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.name === "ZodError" ? error.errors : "Server Error" }, { status: error?.name === "ZodError" ? 400 : 500 });
  }
}
