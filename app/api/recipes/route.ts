import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { searchRecipes, createRecipe } from "@/backend/services/recipe.service";
import { CreateRecipeSchema } from "@/backend/schemas/recipe.schema";
import { handleAPIError } from "@/backend/middleware/error-handler";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q") || undefined;
    const source = searchParams.get("source") || undefined;
    const cookbookId = searchParams.get("cookbookId") || undefined;

    return NextResponse.json(await searchRecipes(userId, query, source, cookbookId));
  } catch (error) { 
    return handleAPIError(error); 
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    body.userId = userId; // Inject userId vào body
    const data = CreateRecipeSchema.parse(body);
    return NextResponse.json(await createRecipe(userId, data), { status: 201 });
  } catch (error: unknown) {
    return handleAPIError(error);
  }
}
