import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updateStep, deleteStep } from "@/backend/services/step.service";
import { UpdateStepSchema } from "@/backend/schemas/step.schema";
import { handleAPIError } from "@/backend/middleware/error-handler";

export async function PUT(req: Request, { params }: { params: { id: string, stepId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const data = UpdateStepSchema.parse(await req.json());
    const result = await updateStep(Number(params.stepId), Number(params.id), userId, data);
    if (!result) return NextResponse.json({ error: "Not Found or Unauthorized" }, { status: 404 });
    return NextResponse.json(result);
  } catch (error) { return handleAPIError(error); }
}

export async function DELETE(req: Request, { params }: { params: { id: string, stepId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const result = await deleteStep(Number(params.stepId), Number(params.id), userId);
    if (!result) return NextResponse.json({ error: "Not Found or Unauthorized" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) { return handleAPIError(error); }
}
