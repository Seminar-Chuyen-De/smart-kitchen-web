import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getRecipesByUser, createRecipe, getRecipeById } from "@/backend/services/recipe.service";
import { CreateRecipeSchema } from "@/backend/schemas/recipe.schema";
import { prisma } from "@/backend/db/client";
import { mapRecipeToFrontend, getEmojiForIngredient } from "@/backend/utils/recipe-mapper";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Đảm bảo User tồn tại trong DB để tránh lỗi khóa ngoại (Foreign Key Constraint)
    let dbUser = await prisma.user.findUnique({ where: { userId } });
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          userId,
          email: `${userId}@smartkitchen.vn`,
          username: `User_${userId.slice(-6)}`,
          avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${userId}`
        }
      });
    }

    let recipes = await getRecipesByUser(userId);
    if (recipes.length === 0) {
      const { seedDefaultRecipesForUser } = await import("@/backend/services/default-recipes");
      await seedDefaultRecipesForUser(userId);
      recipes = await getRecipesByUser(userId);
    }

    return NextResponse.json(recipes.map(mapRecipeToFrontend));
  } catch (error) { 
    console.error("GET recipes error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 }); 
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const body = await req.json();

    // Đảm bảo User tồn tại trong DB để tránh lỗi khóa ngoại (Foreign Key Constraint)
    let dbUser = await prisma.user.findUnique({ where: { userId } });
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          userId,
          email: `${userId}@smartkitchen.vn`,
          username: `User_${userId.slice(-6)}`,
          avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${userId}`
        }
      });
    }

    // Tự động giải quyết nguyên liệu theo tên hoặc đối tượng từ Frontend gửi lên
    const recipeIngredients: any[] = [];
    if (body.ingredients && Array.isArray(body.ingredients)) {
      for (const ing of body.ingredients) {
        if (typeof ing === "string" || (typeof ing === "object" && ing && ing.name)) {
          const cleanName = (typeof ing === "string" ? ing : ing.name).trim();
          if (!cleanName) continue;

          // Tìm nguyên liệu đã có (không phân biệt hoa thường)
          let dbIngredient = await prisma.ingredient.findFirst({
            where: { name: { equals: cleanName, mode: "insensitive" } }
          });

          // Nếu chưa có, tự tạo mới nguyên liệu với emoji thông minh
          if (!dbIngredient) {
            dbIngredient = await prisma.ingredient.create({
              data: {
                name: cleanName,
                icon: getEmojiForIngredient(cleanName),
                bgColor: "#FFF5E6"
              }
            });
          }

          const qtyVal = typeof ing === "object" && ing.quantity !== undefined && ing.quantity !== "" && ing.quantity !== null
            ? Number(ing.quantity)
            : null;

          recipeIngredients.push({
            ingredientId: dbIngredient.ingredientId,
            quantity: qtyVal !== null && !isNaN(qtyVal) ? qtyVal : null,
            unit: typeof ing === "object" && ing.unit && ing.unit.trim() !== "" ? ing.unit.trim() : null,
            note: typeof ing === "object" && ing.note && ing.note.trim() !== "" ? ing.note.trim() : null
          });
        } else if (typeof ing === "object" && ing && ing.ingredientId) {
          const qtyVal = ing.quantity !== undefined && ing.quantity !== "" && ing.quantity !== null
            ? Number(ing.quantity)
            : null;

          recipeIngredients.push({
            ingredientId: Number(ing.ingredientId),
            quantity: qtyVal !== null && !isNaN(qtyVal) ? qtyVal : null,
            unit: ing.unit && ing.unit.trim() !== "" ? ing.unit.trim() : null,
            note: ing.note && ing.note.trim() !== "" ? ing.note.trim() : null
          });
        }
      }
    }

    // Tự động giải quyết các bước thực hiện
    const steps: any[] = [];
    if (body.instructions && Array.isArray(body.instructions)) {
      body.instructions.forEach((inst: string, idx: number) => {
        if (typeof inst === "string" && inst.trim() !== "") {
          steps.push({
            stepNumber: idx + 1,
            instruction: inst.trim(),
            tip: null,
            time: null
          });
        }
      });
    } else if (body.steps && Array.isArray(body.steps)) {
      body.steps.forEach((step: any, idx: number) => {
        if (step && step.instruction && step.instruction.trim() !== "") {
          const timeVal = step.time !== undefined && step.time !== "" && step.time !== null ? Number(step.time) : null;
          steps.push({
            stepNumber: step.stepNumber || (idx + 1),
            instruction: step.instruction.trim(),
            tip: step.tip && step.tip.trim() !== "" ? step.tip.trim() : null,
            time: timeVal !== null && !isNaN(timeVal) ? timeVal : null
          });
        }
      });
    }

    // Ánh xạ dữ liệu snake_case sang camelCase và chuẩn hoá kiểu dữ liệu
    const mappedData = {
      recipesName: body.recipesName || body.recipes_name || "Món ăn mới",
      description: body.description || null,
      imageRecipe: body.imageRecipe || body.image_recipe || null,
      totalTime: body.totalTime !== undefined ? body.totalTime : (body.total_time !== undefined ? Number(body.total_time) : null),
      numberOfServes: body.numberOfServes !== undefined ? body.numberOfServes : (body.number_of_serves !== undefined ? Number(body.number_of_serves) : null),
      sourceType: body.sourceType || body.source_type || "AI_GENERATED",
      ingredients: recipeIngredients.length > 0 ? recipeIngredients : undefined,
      steps: steps.length > 0 ? steps : undefined,
      tags: body.tags || []
    };

    // Kiểm tra định dạng bằng CreateRecipeSchema
    const parsedData = CreateRecipeSchema.parse({
      ...mappedData,
      userId
    });

    const newRecipe = await createRecipe(userId, parsedData);

    // Tự động thêm công thức vừa tạo vào Cookbook đầu tiên (mặc định) của người dùng
    try {
      let defaultCookbook = await prisma.cookbook.findFirst({
        where: { userId }
      });

      if (!defaultCookbook) {
        defaultCookbook = await prisma.cookbook.create({
          data: {
            name: "📖 Công thức yêu thích",
            userId: userId
          }
        });
      }

      await prisma.cookbookRecipe.create({
        data: {
          recipeId: newRecipe.recipeId,
          cookbookId: defaultCookbook.cookbookId
        }
      });
    } catch (err) {
      console.error("Failed to auto-assign recipe to cookbook:", err);
    }
    
    // Tìm lại đối tượng Recipe đầy đủ có liên kết bảng để ánh xạ chính xác
    const fullRecipe = await getRecipeById(newRecipe.recipeId, userId);
    
    // Trả về đối tượng đã được ánh xạ đẹp đẽ sang snake_case
    return NextResponse.json(mapRecipeToFrontend(fullRecipe), { status: 201 });
  } catch (error: any) {
    console.error("Create recipe error:", error?.message || error);
    return NextResponse.json(
      { error: error?.name === "ZodError" ? error.errors : (error?.message || "Server Error") }, 
      { status: error?.name === "ZodError" ? 400 : 500 }
    );
  }
}
