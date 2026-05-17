import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { processImageToRecipe } from "@/ai/agents/orchestrator.agent";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const formData = await req.formData();
    const result = await processImageToRecipe(formData, userId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
