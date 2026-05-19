import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getRecipesByUser, createRecipe, getRecipeById } from "@/backend/services/recipe.service";
import { CreateRecipeSchema } from "@/backend/schemas/recipe.schema";
import { prisma } from "@/backend/db/client";

// Hàm ánh xạ Recipe từ Prisma sang định dạng snake_case của Frontend
export function mapRecipeToFrontend(recipe: any) {
  if (!recipe) return null;
  return {
    recipe_id: recipe.recipeId,
    recipes_name: recipe.recipesName,
    description: recipe.description || undefined,
    image_recipe: recipe.imageRecipe || undefined,
    total_time: recipe.totalTime || undefined,
    calories: recipe.calories || undefined,
    protein: recipe.protein || undefined,
    carbs: recipe.carbs || undefined,
    fats: recipe.fats || undefined,
    source_type: recipe.sourceType || undefined,
    number_of_serves: recipe.numberOfServes || undefined,
    created_at: recipe.createdAt ? recipe.createdAt.toISOString() : new Date().toISOString(),
    updated_at: recipe.updatedAt ? recipe.updatedAt.toISOString() : undefined,
    ingredients: recipe.recipeIngredients?.map((ri: any) => ({
      ingredient_id: ri.ingredientId,
      name: ri.ingredient?.name || "",
      icon: ri.ingredient?.icon || undefined,
      quantity: ri.quantity || undefined,
      unit: ri.unit || undefined,
      note: ri.note || undefined
    })) || [],
    steps: recipe.steps?.map((s: any) => ({
      step_id: s.stepId,
      step_number: s.stepNumber,
      instruction: s.instruction,
      tip: s.tip || undefined,
      time: s.time || undefined
    })) || [],
    tags: recipe.recipeTags?.map((rt: any) => ({
      tag_id: rt.tagId,
      name: rt.tag?.name || "",
      emoji: rt.tag?.emoji || undefined,
      category: rt.tag?.category || undefined
    })) || []
  };
}

// Hàm phân tích tên nguyên liệu để chọn ra Emoji phù hợp nhất
export function getEmojiForIngredient(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("cơm") || lower.includes("gạo")) return "🍚";
  if (lower.includes("trứng")) return "🥚";
  if (
    lower.includes("thịt heo") ||
    lower.includes("thịt lợn") ||
    lower.includes("heo") ||
    lower.includes("lợn") ||
    lower.includes("ham") ||
    lower.includes("xúc xích") ||
    lower.includes("giò") ||
    lower.includes("chả") ||
    lower.includes("lạp xưởng") ||
    lower.includes("thịt nguội")
  ) return "🐷";
  if (lower.includes("bò")) return "🐮";
  if (lower.includes("gà")) return "🐔";
  if (lower.includes("vịt")) return "🦆";
  if (lower.includes("cá")) return "🐟";
  if (lower.includes("tôm")) return "🍤";
  if (lower.includes("cua") || lower.includes("ghẹ")) return "🦀";
  if (lower.includes("mực") || lower.includes("bạch tuộc")) return "🦑";
  if (lower.includes("tỏi")) return "🧄";
  if (lower.includes("hành")) return "🧅";
  if (lower.includes("ớt")) return "🌶️";
  if (lower.includes("cà chua")) return "🍅";
  if (lower.includes("cà rốt")) return "🥕";
  if (lower.includes("ngô") || lower.includes("bắp")) return "🌽";
  if (lower.includes("khoai")) return "🥔";
  if (lower.includes("dưa chuột") || lower.includes("dưa leo") || lower.includes("dưa")) return "🥒";
  if (lower.includes("dứa") || lower.includes("thơm")) return "🍍";
  if (
    lower.includes("rau") ||
    lower.includes("cải") ||
    lower.includes("xà lách") ||
    lower.includes("ngò") ||
    lower.includes("húng") ||
    lower.includes("tía tô") ||
    lower.includes("mùi") ||
    lower.includes("hành lá")
  ) return "🥬";
  if (lower.includes("nấm") || lower.includes("mộc nhĩ")) return "🍄";
  if (lower.includes("đậu") || lower.includes("đỗ") || lower.includes("tương")) return "🫘";
  if (lower.includes("bí") || lower.includes("mướp")) return "🍈";
  if (lower.includes("chanh")) return "🍋";
  if (lower.includes("bột") || lower.includes("mì") || lower.includes("nui")) return "🌾";
  if (lower.includes("bánh")) return "🫓";
  if (lower.includes("sữa")) return "🥛";
  if (lower.includes("phô mai") || lower.includes("cheese")) return "🧀";
  if (lower.includes("dầu") || lower.includes("mỡ") || lower.includes("bơ")) return "🥑";
  if (lower.includes("mắm") || lower.includes("xì dầu") || lower.includes("nước tương")) return "🍶";
  if (lower.includes("muối") || lower.includes("đường") || lower.includes("tiêu") || lower.includes("hạt nêm") || lower.includes("gia vị")) return "🧂";
  if (lower.includes("bún") || lower.includes("phở") || lower.includes("hủ tiếu") || lower.includes("mỳ")) return "🍜";
  if (lower.includes("giá đỗ") || lower.includes("giá")) return "🌱";
  return "🍳"; // mặc định
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const recipes = await getRecipesByUser(userId);
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

    // Tự động giải quyết nguyên liệu theo tên (nếu được truyền dạng danh sách text)
    const recipeIngredients: any[] = [];
    if (body.ingredients && Array.isArray(body.ingredients)) {
      for (const ing of body.ingredients) {
        if (typeof ing === "string") {
          const cleanName = ing.trim();
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

          recipeIngredients.push({
            ingredientId: dbIngredient.ingredientId,
            quantity: null,
            unit: null,
            note: null
          });
        } else if (typeof ing === "object" && ing.ingredientId) {
          recipeIngredients.push(ing);
        }
      }
    }

    // Tự động giải quyết các bước thực hiện
    const steps: any[] = [];
    if (body.instructions && Array.isArray(body.instructions)) {
      body.instructions.forEach((inst: string, idx: number) => {
        steps.push({
          stepNumber: idx + 1,
          instruction: inst,
          tip: null,
          time: null
        });
      });
    } else if (body.steps && Array.isArray(body.steps)) {
      steps.push(...body.steps);
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
