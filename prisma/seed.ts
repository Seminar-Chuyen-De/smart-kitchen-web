import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Demo user
  const user = await prisma.user.upsert({
    where: { userId: "user_38k6tDJSZWNF3b2tEnXkvFDluSR" },
    update: {},
    create: {
      userId: "user_38k6tDJSZWNF3b2tEnXkvFDluSR",
      email: "son2522004@gmail.com",
      username: "Bá Sơn",
    },
  });

  // Clear old data for idempotent seeding
  await prisma.cookbookRecipe.deleteMany({});
  await prisma.recipeTag.deleteMany({});
  await prisma.recipeIngredient.deleteMany({});
  await prisma.step.deleteMany({});
  await prisma.recipe.deleteMany({ where: { userId: user.userId } });
  await prisma.cookbook.deleteMany({ where: { userId: user.userId } });

  // Demo ingredients
  const egg = await prisma.ingredient.upsert({ where: { name: "Trứng" }, update: {}, create: { name: "Trứng", icon: "🥚" } });
  const rice = await prisma.ingredient.upsert({ where: { name: "Cơm nguội" }, update: {}, create: { name: "Cơm nguội", icon: "🍚" } });
  const oil = await prisma.ingredient.upsert({ where: { name: "Dầu ăn" }, update: {}, create: { name: "Dầu ăn", icon: "🛢️" } });
  const pork = await prisma.ingredient.upsert({ where: { name: "Thịt heo" }, update: {}, create: { name: "Thịt heo", icon: "🥩" } });
  const beef = await prisma.ingredient.upsert({ where: { name: "Thịt bò" }, update: {}, create: { name: "Thịt bò", icon: "🥩" } });
  const tomato = await prisma.ingredient.upsert({ where: { name: "Cà chua" }, update: {}, create: { name: "Cà chua", icon: "🍅" } });
  const onion = await prisma.ingredient.upsert({ where: { name: "Hành tây" }, update: {}, create: { name: "Hành tây", icon: "🧅" } });
  const garlic = await prisma.ingredient.upsert({ where: { name: "Tỏi" }, update: {}, create: { name: "Tỏi", icon: "🧄" } });
  const fishSauce = await prisma.ingredient.upsert({ where: { name: "Nước mắm" }, update: {}, create: { name: "Nước mắm", icon: "🍶" } });
  const sugar = await prisma.ingredient.upsert({ where: { name: "Đường" }, update: {}, create: { name: "Đường", icon: "🧂" } });
  const waterSpinach = await prisma.ingredient.upsert({ where: { name: "Rau muống" }, update: {}, create: { name: "Rau muống", icon: "🥬" } });
  const mushroom = await prisma.ingredient.upsert({ where: { name: "Nấm" }, update: {}, create: { name: "Nấm", icon: "🍄" } });
  const scallion = await prisma.ingredient.upsert({ where: { name: "Hành lá" }, update: {}, create: { name: "Hành lá", icon: "🌿" } });
  const salt = await prisma.ingredient.upsert({ where: { name: "Muối" }, update: {}, create: { name: "Muối", icon: "🧂" } });
  const pepper = await prisma.ingredient.upsert({ where: { name: "Tiêu" }, update: {}, create: { name: "Tiêu", icon: "🧂" } });

  // Demo tags
  const breakfastTag = await prisma.tag.upsert({ where: { name: "Bữa sáng" }, update: {}, create: { name: "Bữa sáng", category: "Bữa ăn", emoji: "🌅" } });
  const lunchTag = await prisma.tag.upsert({ where: { name: "Bữa trưa" }, update: {}, create: { name: "Bữa trưa", category: "Bữa ăn", emoji: "☀️" } });
  const dinnerTag = await prisma.tag.upsert({ where: { name: "Bữa tối" }, update: {}, create: { name: "Bữa tối", category: "Bữa ăn", emoji: "🌙" } });
  const mainDishTag = await prisma.tag.upsert({ where: { name: "Món mặn" }, update: {}, create: { name: "Món mặn", category: "Loại món", emoji: "🥘" } });
  const soupTag = await prisma.tag.upsert({ where: { name: "Món canh" }, update: {}, create: { name: "Món canh", category: "Loại món", emoji: "🥣" } });
  const vegetarianTag = await prisma.tag.upsert({ where: { name: "Món chay" }, update: {}, create: { name: "Món chay", category: "Loại món", emoji: "🥗" } });
  const stirFriedTag = await prisma.tag.upsert({ where: { name: "Món xào" }, update: {}, create: { name: "Món xào", category: "Loại món", emoji: "🍳" } });

  // Demo recipes
  const recipe1 = await prisma.recipe.create({
    data: {
      recipesName: "Cơm chiên trứng đơn giản",
      description: "Món cơm chiên nhanh, dễ làm với nguyên liệu cơ bản",
      totalTime: 15,
      numberOfServes: 2,
      sourceType: "AI_GENERATED",
      userId: user.userId,
      steps: {
        create: [
          { stepNumber: 1, instruction: "Đập trứng ra bát, đánh đều.", time: 2 },
          { stepNumber: 2, instruction: "Đun nóng dầu trong chảo, cho trứng vào xào chín.", time: 3 },
          { stepNumber: 3, instruction: "Thêm cơm vào, đảo đều với trứng.", time: 5 },
          { stepNumber: 4, instruction: "Nêm gia vị vừa ăn.", time: 2 },
          { stepNumber: 5, instruction: "Cho hành lá vào, tắt bếp.", time: 1 },
        ],
      },
      recipeIngredients: {
        create: [
          { ingredientId: egg.ingredientId, quantity: 2, unit: "quả" },
          { ingredientId: rice.ingredientId, quantity: 2, unit: "bát" },
          { ingredientId: oil.ingredientId, quantity: 1, unit: "muỗng" },
        ],
      },
      recipeTags: {
        create: [{ tagId: breakfastTag.tagId }],
      },
    },
  });

  const recipe2 = await prisma.recipe.create({
    data: {
      recipesName: "Thịt kho tàu",
      description: "Món thịt kho truyền thống đậm đà hương vị",
      totalTime: 60,
      numberOfServes: 4,
      sourceType: "MANUAL",
      userId: user.userId,
      steps: {
        create: [
          { stepNumber: 1, instruction: "Thịt heo rửa sạch, thái miếng vuông.", time: 10 },
          { stepNumber: 2, instruction: "Ướp thịt với nước mắm, đường, hành tỏi băm trong 30 phút.", time: 30 },
          { stepNumber: 3, instruction: "Thắng đường tạo nước màu, cho thịt vào xào săn.", time: 5 },
          { stepNumber: 4, instruction: "Đổ nước dừa ngập thịt, đun nhỏ lửa đến khi thịt mềm.", time: 40 },
          { stepNumber: 5, instruction: "Cho trứng luộc vào, đun thêm 10 phút.", time: 10 },
        ],
      },
      recipeIngredients: {
        create: [
          { ingredientId: pork.ingredientId, quantity: 500, unit: "gram" },
          { ingredientId: egg.ingredientId, quantity: 4, unit: "quả" },
          { ingredientId: garlic.ingredientId, quantity: 2, unit: "tép" },
          { ingredientId: fishSauce.ingredientId, quantity: 3, unit: "muỗng" },
          { ingredientId: sugar.ingredientId, quantity: 2, unit: "muỗng" },
        ],
      },
      recipeTags: {
        create: [{ tagId: lunchTag.tagId }, { tagId: dinnerTag.tagId }, { tagId: mainDishTag.tagId }],
      },
    },
  });

  const recipe3 = await prisma.recipe.create({
    data: {
      recipesName: "Canh cà chua trứng",
      description: "Món canh thanh mát, giải nhiệt rất dễ nấu",
      totalTime: 15,
      numberOfServes: 3,
      sourceType: "AI_GENERATED",
      userId: user.userId,
      steps: {
        create: [
          { stepNumber: 1, instruction: "Cà chua rửa sạch, thái múi cau.", time: 2 },
          { stepNumber: 2, instruction: "Trứng đập ra bát, đánh tan.", time: 1 },
          { stepNumber: 3, instruction: "Phi thơm hành tỏi, cho cà chua vào xào mềm.", time: 3 },
          { stepNumber: 4, instruction: "Đổ lượng nước vừa đủ, đun sôi.", time: 5 },
          { stepNumber: 5, instruction: "Từ từ đổ trứng vào nồi, khuấy nhẹ tay, nêm gia vị rồi tắt bếp.", time: 3 },
        ],
      },
      recipeIngredients: {
        create: [
          { ingredientId: tomato.ingredientId, quantity: 3, unit: "quả" },
          { ingredientId: egg.ingredientId, quantity: 2, unit: "quả" },
          { ingredientId: oil.ingredientId, quantity: 1, unit: "muỗng" },
        ],
      },
      recipeTags: {
        create: [{ tagId: lunchTag.tagId }, { tagId: soupTag.tagId }],
      },
    },
  });

  const recipe4 = await prisma.recipe.create({
    data: {
      recipesName: "Bò lúc lắc",
      description: "Thịt bò mềm ngọt xào cùng ớt chuông và hành tây",
      totalTime: 30,
      numberOfServes: 2,
      sourceType: "AI_GENERATED",
      userId: user.userId,
      steps: {
        create: [
          { stepNumber: 1, instruction: "Thịt bò thái khối vuông, ướp với gia vị trong 15 phút.", time: 15 },
          { stepNumber: 2, instruction: "Hành tây, cà chua thái múi cau.", time: 5 },
          { stepNumber: 3, instruction: "Làm nóng chảo, xào nhanh thịt bò với lửa lớn rồi trút ra đĩa.", time: 5 },
          { stepNumber: 4, instruction: "Phi tỏi thơm, xào hành tây, cà chua.", time: 3 },
          { stepNumber: 5, instruction: "Cho thịt bò lại vào chảo, đảo đều, nêm nếm và tắt bếp.", time: 2 },
        ],
      },
      recipeIngredients: {
        create: [
          { ingredientId: beef.ingredientId, quantity: 300, unit: "gram" },
          { ingredientId: onion.ingredientId, quantity: 1, unit: "củ" },
          { ingredientId: tomato.ingredientId, quantity: 1, unit: "quả" },
          { ingredientId: garlic.ingredientId, quantity: 3, unit: "tép" },
          { ingredientId: salt.ingredientId, quantity: 1, unit: "muỗng cafe" },
          { ingredientId: pepper.ingredientId, quantity: 1, unit: "muỗng cafe" },
        ],
      },
      recipeTags: {
        create: [{ tagId: dinnerTag.tagId }, { tagId: mainDishTag.tagId }, { tagId: stirFriedTag.tagId }],
      },
    },
  });

  const recipe5 = await prisma.recipe.create({
    data: {
      recipesName: "Rau muống xào tỏi",
      description: "Món xào dân dã, giòn ngon và cực kỳ đưa cơm",
      totalTime: 10,
      numberOfServes: 4,
      sourceType: "MANUAL",
      userId: user.userId,
      steps: {
        create: [
          { stepNumber: 1, instruction: "Rau muống nhặt sạch, rửa và để ráo nước.", time: 5 },
          { stepNumber: 2, instruction: "Tỏi đập dập.", time: 1 },
          { stepNumber: 3, instruction: "Đun nóng dầu ăn, phi thơm tỏi.", time: 2 },
          { stepNumber: 4, instruction: "Cho rau muống vào xào nhanh tay trên lửa lớn.", time: 1 },
          { stepNumber: 5, instruction: "Nêm nếm gia vị vừa ăn, tắt bếp.", time: 1 },
        ],
      },
      recipeIngredients: {
        create: [
          { ingredientId: waterSpinach.ingredientId, quantity: 500, unit: "gram" },
          { ingredientId: garlic.ingredientId, quantity: 5, unit: "tép" },
          { ingredientId: oil.ingredientId, quantity: 2, unit: "muỗng" },
          { ingredientId: salt.ingredientId, quantity: 1, unit: "muỗng cafe" },
        ],
      },
      recipeTags: {
        create: [{ tagId: lunchTag.tagId }, { tagId: dinnerTag.tagId }, { tagId: stirFriedTag.tagId }],
      },
    },
  });

  const recipe6 = await prisma.recipe.create({
    data: {
      recipesName: "Nấm xào chay",
      description: "Món chay thanh đạm từ các loại nấm",
      totalTime: 15,
      numberOfServes: 2,
      sourceType: "MANUAL",
      userId: user.userId,
      steps: {
        create: [
          { stepNumber: 1, instruction: "Nấm rửa sạch, thái miếng vừa ăn.", time: 5 },
          { stepNumber: 2, instruction: "Phi thơm hành lá.", time: 2 },
          { stepNumber: 3, instruction: "Cho nấm vào xào nhanh tay.", time: 5 },
          { stepNumber: 4, instruction: "Nêm gia vị chay, thêm chút tiêu cho thơm.", time: 3 },
        ],
      },
      recipeIngredients: {
        create: [
          { ingredientId: mushroom.ingredientId, quantity: 300, unit: "gram" },
          { ingredientId: scallion.ingredientId, quantity: 2, unit: "nhánh" },
          { ingredientId: oil.ingredientId, quantity: 1, unit: "muỗng" },
          { ingredientId: salt.ingredientId, quantity: 1, unit: "muỗng cafe" },
        ],
      },
      recipeTags: {
        create: [{ tagId: vegetarianTag.tagId }, { tagId: stirFriedTag.tagId }],
      },
    },
  });

  // Demo cookbooks (dùng junction table cookbookRecipes)
  await prisma.cookbook.create({
    data: {
      name: "Công thức AI đầu tiên",
      userId: user.userId,
      cookbookRecipes: {
        create: [{ recipeId: recipe1.recipeId }, { recipeId: recipe3.recipeId }],
      },
    },
  });

  await prisma.cookbook.create({
    data: {
      name: "Món ngon gia đình",
      userId: user.userId,
      cookbookRecipes: {
        create: [{ recipeId: recipe2.recipeId }, { recipeId: recipe3.recipeId }],
      },
    },
  });

  await prisma.cookbook.create({
    data: {
      name: "Thực đơn chay thanh tịnh",
      userId: user.userId,
      cookbookRecipes: {
        create: [{ recipeId: recipe6.recipeId }],
      },
    },
  });

  await prisma.cookbook.create({
    data: {
      name: "Tiệc cuối tuần",
      userId: user.userId,
      cookbookRecipes: {
        create: [{ recipeId: recipe2.recipeId }, { recipeId: recipe4.recipeId }],
      },
    },
  });

  console.log("✅ Seed database thành công!");
  console.log(`   - User: ${user.userId}`);
  console.log(`   - Recipes: recipe1=${recipe1.recipeId}, recipe2=${recipe2.recipeId}, ...`);
  console.log(`   - Cookbooks: 4 cookbooks đã được tạo`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
