import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/backend/db/client";

// PUT rename cookbook
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: "Vui lòng cung cấp tên mới" }, { status: 400 });
    }

    const updated = await prisma.cookbook.update({
      where: { cookbookId: Number(params.id), userId },
      data: { name: body.name }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Rename cookbook error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// DELETE cookbook
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const deleted = await prisma.cookbook.delete({
      where: { cookbookId: Number(params.id), userId }
    });

    return NextResponse.json(deleted);
  } catch (error: any) {
    console.error("Delete cookbook error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
