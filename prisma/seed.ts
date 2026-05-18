import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Clear old data (Optional but recommended for clean seed)
  await prisma.cookbookRecipe.deleteMany({});
  await prisma.recipeIngredient.deleteMany({});
  await prisma.recipeTag.deleteMany({});
  await prisma.step.deleteMany({});
  await prisma.recipe.deleteMany({});
  await prisma.cookbook.deleteMany({});
  await prisma.ingredient.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.scanLog.deleteMany({});

  // 2. Create demo user
  const user = await prisma.user.create({
    data: {
      userId:   "demo_clerk_user_id",
      email:    "demo@smartkitchen.vn",
      username: "Demo User",
      avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=DemoUser",
    },
  });

  // 3. Create demo ingredients
  const rice = await prisma.ingredient.create({
    data: { name: "Cơm nguội", icon: "🍚", bgColor: "#FFF9E6" },
  });
  const egg = await prisma.ingredient.create({
    data: { name: "Trứng", icon: "🥚", bgColor: "#FFF5E6" },
  });
  const scallions = await prisma.ingredient.create({
    data: { name: "Hành lá", icon: "🌱", bgColor: "#E6F7ED" },
  });

  // 4. Create demo tags
  const easyTag = await prisma.tag.create({
    data: { name: "Dễ làm", category: "Độ khó", emoji: "🍳" },
  });
  const breakfastTag = await prisma.tag.create({
    data: { name: "Bữa sáng", category: "Bữa ăn", emoji: "🌅" },
  });

  // 5. Create demo cookbook
  const cookbook = await prisma.cookbook.create({
    data: {
      name:    "Công thức yêu thích",
      userId:  user.userId,
    },
  });

  // 6. Create demo recipe
  const recipe = await prisma.recipe.create({
    data: {
      userId:         user.userId,
      recipesName:    "Cơm chiên trứng đơn giản",
      description:    "Món cơm chiên nhanh, dễ làm với nguyên liệu cơ bản cho bữa sáng.",
      totalTime:      15,
      calories:       350,
      protein:        12,
      carbs:          45,
      fats:           10,
      sourceType:     "AI_GENERATED",
      numberOfServes: 2,
      steps: {
        create: [
          { stepNumber: 1, instruction: "Đập trứng ra bát, đánh đều.", time: 2 },
          { stepNumber: 2, instruction: "Đun nóng dầu trong chảo, cho trứng vào xào chín sơ rồi xúc ra.", time: 3 },
          { stepNumber: 3, instruction: "Thêm chút dầu vào chảo, cho cơm nguội vào đảo săn.", time: 5 },
          { stepNumber: 4, instruction: "Trút trứng lại vào chảo cơm, nêm mắm muối vừa ăn, đảo đều.", time: 3 },
          { stepNumber: 5, instruction: "Rắc hành lá xắt nhỏ, đảo thêm 1 phút rồi tắt bếp.", time: 2 },
        ],
      },
      recipeIngredients: {
        create: [
          { ingredientId: rice.ingredientId, quantity: 2, unit: "bát", note: "Cơm nguội để tủ lạnh sẽ ngon hơn" },
          { ingredientId: egg.ingredientId, quantity: 2, unit: "quả" },
          { ingredientId: scallions.ingredientId, note: "Hành lá thái nhỏ" },
        ],
      },
      recipeTags: {
        create: [
          { tagId: easyTag.tagId },
          { tagId: breakfastTag.tagId },
        ],
      },
      cookbookRecipes: {
        create: [
          { cookbookId: cookbook.cookbookId },
        ],
      },
    },
  });

  console.log("✅ Seed database thành công với recipe ID:", recipe.recipeId);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
