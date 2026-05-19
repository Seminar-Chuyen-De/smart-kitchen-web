import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserById, updateUser } from "@/backend/services/user.service";
import { UpdateUserSchema } from "@/backend/schemas/user.schema";
import { handleAPIError } from "@/backend/middleware/error-handler";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getUserById(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const data = UpdateUserSchema.parse(body);
    
    const updatedUser = await updateUser(userId, data);
    return NextResponse.json(updatedUser);
  } catch (error) {
    return handleAPIError(error);
  }
}
