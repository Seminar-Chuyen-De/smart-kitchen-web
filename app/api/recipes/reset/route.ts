import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/backend/db/client";
import { seedDefaultRecipesForUser } from "@/backend/services/default-recipes";
import { getRecipesByUser } from "@/backend/services/recipe.service";
import { mapRecipeToFrontend } from "@/backend/utils/recipe-mapper";

/**
 * POST /api/recipes/reset
 * Xóa toàn bộ AI_GENERATED recipes của user và seed lại với đầy đủ steps.
 * Dùng để fix recipes cũ không có steps trong DB.
 */
export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Chỉ xóa AI_GENERATED recipes (giữ lại MANUAL của user)
    const deleted = await prisma.recipe.deleteMany({
      where: { userId, sourceType: "AI_GENERATED" },
    });

    console.log(`🗑️ Deleted ${deleted.count} AI_GENERATED recipes for user: ${userId}`);

    // Re-seed với đầy đủ steps
    await seedDefaultRecipesForUser(userId);

    // Trả về danh sách recipes mới
    const recipes = await getRecipesByUser(userId);

    return NextResponse.json({
      message: `Đã xóa ${deleted.count} recipes cũ và seed lại thành công.`,
      count: recipes.length,
      recipes: recipes.map(mapRecipeToFrontend),
    });
  } catch (error) {
    console.error("Reset recipes error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

