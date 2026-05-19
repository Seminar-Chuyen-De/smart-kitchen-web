import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/backend/db/client";

// POST add recipe to cookbook
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    if (!body.recipeId) {
      return NextResponse.json({ error: "Vui lòng cung cấp recipeId" }, { status: 400 });
    }

    // Verify ownership of the cookbook
    const cookbook = await prisma.cookbook.findFirst({
      where: { cookbookId: Number(params.id), userId }
    });
    if (!cookbook) {
      return NextResponse.json({ error: "Cookbook not found" }, { status: 404 });
    }

    const linked = await prisma.cookbookRecipe.create({
      data: {
        recipeId: Number(body.recipeId),
        cookbookId: Number(params.id)
      }
    });

    return NextResponse.json(linked, { status: 201 });
  } catch (error: any) {
    console.error("Add recipe to cookbook error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// DELETE remove recipe from cookbook
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    if (!body.recipeId) {
      return NextResponse.json({ error: "Vui lòng cung cấp recipeId" }, { status: 400 });
    }

    // Verify ownership of the cookbook
    const cookbook = await prisma.cookbook.findFirst({
      where: { cookbookId: Number(params.id), userId }
    });
    if (!cookbook) {
      return NextResponse.json({ error: "Cookbook not found" }, { status: 404 });
    }

    const unlinked = await prisma.cookbookRecipe.delete({
      where: {
        recipeId_cookbookId: {
          recipeId: Number(body.recipeId),
          cookbookId: Number(params.id)
        }
      }
    });

    return NextResponse.json(unlinked);
  } catch (error: any) {
    console.error("Remove recipe from cookbook error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
