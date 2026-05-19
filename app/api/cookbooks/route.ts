import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/backend/db/client";
import { mapRecipeToFrontend } from "@/backend/utils/recipe-mapper";

// GET all cookbooks
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Đảm bảo User tồn tại
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

    // Lấy danh sách cookbooks
    let cookbooks = await prisma.cookbook.findMany({
      where: { userId },
      include: {
        cookbookRecipes: {
          include: {
            recipe: {
              include: {
                steps: { orderBy: { stepNumber: "asc" } },
                recipeIngredients: { include: { ingredient: true } },
                recipeTags: { include: { tag: true } }
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Nếu người dùng chưa có cookbook nào, tạo tự động 1 cookbook mặc định
    if (cookbooks.length === 0) {
      const defaultCookbook = await prisma.cookbook.create({
        data: {
          name: "📖 Công thức yêu thích",
          userId: userId
        },
        include: {
          cookbookRecipes: {
            include: {
              recipe: {
                include: {
                  steps: { orderBy: { stepNumber: "asc" } },
                  recipeIngredients: { include: { ingredient: true } },
                  recipeTags: { include: { tag: true } }
                }
              }
            }
          }
        }
      });
      cookbooks = [defaultCookbook];
    }

    // Ánh xạ sang cấu trúc camelCase / snake_case của Frontend
    const mapped = cookbooks.map(cb => {
      const recipes = cb.cookbookRecipes
        .map(cr => mapRecipeToFrontend(cr.recipe))
        .filter(r => r !== null);

      return {
        cookbook_id: cb.cookbookId,
        name: cb.name,
        created_at: cb.createdAt.toISOString(),
        _count: { recipes: recipes.length },
        recipes: recipes
      };
    });

    return NextResponse.json(mapped);
  } catch (error: any) {
    console.error("Fetch cookbooks error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// POST create cookbook
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: "Vui lòng cung cấp tên Cookbook" }, { status: 400 });
    }

    const cb = await prisma.cookbook.create({
      data: {
        name: body.name,
        userId: userId
      }
    });

    return NextResponse.json({
      cookbook_id: cb.cookbookId,
      name: cb.name,
      created_at: cb.createdAt.toISOString(),
      _count: { recipes: 0 },
      recipes: []
    }, { status: 201 });
  } catch (error: any) {
    console.error("Create cookbook error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
