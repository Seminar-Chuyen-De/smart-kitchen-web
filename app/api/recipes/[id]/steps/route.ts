import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getStepsByRecipe, createStep } from "@/backend/services/step.service";
import { CreateStepSchema } from "@/backend/schemas/step.schema";
import { handleAPIError } from "@/backend/middleware/error-handler";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    return NextResponse.json(await getStepsByRecipe(Number(id)));
  } catch (error) { return handleAPIError(error); }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const data = CreateStepSchema.parse(await req.json());
    const result = await createStep(Number(id), userId, data);
    if (!result) return NextResponse.json({ error: "Not Found or Unauthorized" }, { status: 404 });
    return NextResponse.json(result, { status: 201 });
  } catch (error) { return handleAPIError(error); }
}

