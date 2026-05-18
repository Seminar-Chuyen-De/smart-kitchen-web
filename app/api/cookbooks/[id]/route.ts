import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCookbookById, updateCookbook, deleteCookbook } from "@/backend/services/cookbook.service";
import { UpdateCookbookSchema } from "@/backend/schemas/cookbook.schema";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const cookbook = await getCookbookById(params.id, userId);
    if (!cookbook) return NextResponse.json({ error: "Not Found" }, { status: 404 });
    return NextResponse.json(cookbook);
  } catch (e) { return NextResponse.json({ error: "Server Error" }, { status: 500 }); }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const data = UpdateCookbookSchema.parse(await req.json());
    const result = await updateCookbook(params.id, userId, data);
    if (!result) return NextResponse.json({ error: "Not Found or Unauthorized" }, { status: 404 });
    return NextResponse.json(result);
  } catch (e: any) { 
    return NextResponse.json({ error: e?.name === "ZodError" ? e.errors : "Server Error" }, { status: e?.name === "ZodError" ? 400 : 500 }); 
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const result = await deleteCookbook(params.id, userId);
    if (!result) return NextResponse.json({ error: "Not Found or Unauthorized" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ error: "Server Error" }, { status: 500 }); }
}
