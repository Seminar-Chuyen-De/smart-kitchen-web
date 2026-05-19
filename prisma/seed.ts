import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Demo user
  const user = await prisma.user.upsert({
    where: { id: "demo_clerk_user_id" },
    update: {},
    create: {
      id: "demo_clerk_user_id",
      email: "demo@smartkitchen.vn",
      username: "Demo User",
    },
  });

  // Clear old data for idempotent seeding
  await prisma.cookbookRecipe.deleteMany({});
  await prisma.recipeTag.deleteMany({});
  await prisma.recipeIngredient.deleteMany({});
  await prisma.step.deleteMany({});
  await prisma.recipe.deleteMany({ where: { userId: user.id } });
  await prisma.cookbook.deleteMany({ where: { userId: user.id } });

  // Demo ingredients
  const egg = await prisma.ingredient.upsert({ where: { name: "Trứng" }, update: {}, create: { name: "Trứng", icon: "🥚" } });
  const rice = await prisma.ingredient.upsert({ where: { name: "Cơm nguội" }, update: {}, create: { name: "Cơm nguội", icon: "🍚" } });
  const oil = await prisma.ingredient.upsert({ where: { name: "Dầu ăn" }, update: {}, create: { name: "Dầu ăn", icon: "🛢️" } });
  const pork = await prisma.ingredient.upsert({ where: { name: "Thịt heo" }, update: {}, create: { name: "Thịt heo", icon: "🥩" } });
  const chicken = await prisma.ingredient.upsert({ where: { name: "Thịt gà" }, update: {}, create: { name: "Thịt gà", icon: "🍗" } });
  const tomato = await prisma.ingredient.upsert({ where: { name: "Cà chua" }, update: {}, create: { name: "Cà chua", icon: "🍅" } });
  const onion = await prisma.ingredient.upsert({ where: { name: "Hành tây" }, update: {}, create: { name: "Hành tây", icon: "🧅" } });
  const garlic = await prisma.ingredient.upsert({ where: { name: "Tỏi" }, update: {}, create: { name: "Tỏi", icon: "🧄" } });
  const fishSauce = await prisma.ingredient.upsert({ where: { name: "Nước mắm" }, update: {}, create: { name: "Nước mắm", icon: "🍶" } });
  const sugar = await prisma.ingredient.upsert({ where: { name: "Đường" }, update: {}, create: { name: "Đường", icon: "🧂" } });
  const beef = await prisma.ingredient.upsert({ where: { name: "Thịt bò" }, update: {}, create: { name: "Thịt bò", icon: "🥩" } });
  const shrimp = await prisma.ingredient.upsert({ where: { name: "Tôm" }, update: {}, create: { name: "Tôm", icon: "🍤" } });
  const waterSpinach = await prisma.ingredient.upsert({ where: { name: "Rau muống" }, update: {}, create: { name: "Rau muống", icon: "🥬" } });
  const potato = await prisma.ingredient.upsert({ where: { name: "Khoai tây" }, update: {}, create: { name: "Khoai tây", icon: "🥔" } });
  const carrot = await prisma.ingredient.upsert({ where: { name: "Cà rốt" }, update: {}, create: { name: "Cà rốt", icon: "🥕" } });
  const mushroom = await prisma.ingredient.upsert({ where: { name: "Nấm" }, update: {}, create: { name: "Nấm", icon: "🍄" } });
  const ginger = await prisma.ingredient.upsert({ where: { name: "Gừng" }, update: {}, create: { name: "Gừng", icon: "🫚" } });
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
  const grilledTag = await prisma.tag.upsert({ where: { name: "Món nướng" }, update: {}, create: { name: "Món nướng", category: "Loại món", emoji: "🍢" } });
  const stirFriedTag = await prisma.tag.upsert({ where: { name: "Món xào" }, update: {}, create: { name: "Món xào", category: "Loại món", emoji: "🍳" } });
  const snackTag = await prisma.tag.upsert({ where: { name: "Ăn vặt" }, update: {}, create: { name: "Ăn vặt", category: "Loại món", emoji: "🍟" } });

  // Demo recipes
  const recipe1 = await prisma.recipe.create({
    data: {
      recipesName: "Cơm chiên trứng đơn giản",
      description: "Món cơm chiên nhanh, dễ làm với nguyên liệu cơ bản",
      totalTime: 15,
      numberOfServes: 2,
      sourceType: "AI_GENERATED",
      userId: user.id,
      steps: {
        create: [
          { stepNumber: 1, instruction: "Đập trứng ra bát, đánh đều.", time: 2 },
          { stepNumber: 2, instruction: "Đun nóng dầu trong chảo, cho trứng vào xào chín.", time: 3 },
          { stepNumber: 3, instruction: "Thêm cơm vào, đảo đều với trứng.", time: 5 },
          { stepNumber: 4, instruction: "Nêm gia vị vừa ăn.", time: 2 },
          { stepNumber: 5, instruction: "Cho hành lá vào, tắt bếp.", time: 1 },
        ],
      },
      ingredients: {
        create: [
          { ingredientId: egg.id, quantity: 2, unit: "quả" },
          { ingredientId: rice.id, quantity: 2, unit: "bát" },
          { ingredientId: oil.id, quantity: 1, unit: "muỗng" },
        ],
      },
      tags: {
        create: [{ tagId: breakfastTag.id }],
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
      userId: user.id,
      steps: {
        create: [
          { stepNumber: 1, instruction: "Thịt heo rửa sạch, thái miếng vuông.", time: 10 },
          { stepNumber: 2, instruction: "Ướp thịt với nước mắm, đường, hành tỏi băm trong 30 phút.", time: 30 },
          { stepNumber: 3, instruction: "Thắng đường tạo nước màu, cho thịt vào xào săn.", time: 5 },
          { stepNumber: 4, instruction: "Đổ nước dừa ngập thịt, đun nhỏ lửa đến khi thịt mềm.", time: 40 },
          { stepNumber: 5, instruction: "Cho trứng luộc vào, đun thêm 10 phút.", time: 10 },
        ],
      },
      ingredients: {
        create: [
          { ingredientId: pork.id, quantity: 500, unit: "gram" },
          { ingredientId: egg.id, quantity: 4, unit: "quả" },
          { ingredientId: garlic.id, quantity: 2, unit: "tép" },
          { ingredientId: fishSauce.id, quantity: 3, unit: "muỗng" },
          { ingredientId: sugar.id, quantity: 2, unit: "muỗng" },
        ],
      },
      tags: {
        create: [{ tagId: lunchTag.id }, { tagId: dinnerTag.id }, { tagId: mainDishTag.id }],
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
      userId: user.id,
      steps: {
        create: [
          { stepNumber: 1, instruction: "Cà chua rửa sạch, thái múi cau.", time: 2 },
          { stepNumber: 2, instruction: "Trứng đập ra bát, đánh tan.", time: 1 },
          { stepNumber: 3, instruction: "Phi thơm hành tỏi, cho cà chua vào xào mềm.", time: 3 },
          { stepNumber: 4, instruction: "Đổ lượng nước vừa đủ, đun sôi.", time: 5 },
          { stepNumber: 5, instruction: "Từ từ đổ trứng vào nồi, khuấy nhẹ tay, nêm gia vị rồi tắt bếp.", time: 3 },
        ],
      },
      ingredients: {
        create: [
          { ingredientId: tomato.id, quantity: 3, unit: "quả" },
          { ingredientId: egg.id, quantity: 2, unit: "quả" },
          { ingredientId: oil.id, quantity: 1, unit: "muỗng" },
        ],
      },
      tags: {
        create: [{ tagId: lunchTag.id }, { tagId: soupTag.id }],
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
      userId: user.id,
      steps: {
        create: [
          { stepNumber: 1, instruction: "Thịt bò thái khối vuông, ướp với gia vị trong 15 phút.", time: 15 },
          { stepNumber: 2, instruction: "Hành tây, cà chua thái múi cau.", time: 5 },
          { stepNumber: 3, instruction: "Làm nóng chảo, xào nhanh thịt bò với lửa lớn rồi trút ra đĩa.", time: 5 },
          { stepNumber: 4, instruction: "Phi tỏi thơm, xào hành tây, cà chua.", time: 3 },
          { stepNumber: 5, instruction: "Cho thịt bò lại vào chảo, đảo đều, nêm nếm và tắt bếp.", time: 2 },
        ],
      },
      ingredients: {
        create: [
          { ingredientId: beef.id, quantity: 300, unit: "gram" },
          { ingredientId: onion.id, quantity: 1, unit: "củ" },
          { ingredientId: tomato.id, quantity: 1, unit: "quả" },
          { ingredientId: garlic.id, quantity: 3, unit: "tép" },
          { ingredientId: salt.id, quantity: 1, unit: "muỗng cafe" },
          { ingredientId: pepper.id, quantity: 1, unit: "muỗng cafe" },
        ],
      },
      tags: {
        create: [{ tagId: dinnerTag.id }, { tagId: mainDishTag.id }, { tagId: stirFriedTag.id }],
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
      userId: user.id,
      steps: {
        create: [
          { stepNumber: 1, instruction: "Rau muống nhặt sạch, rửa và để ráo nước.", time: 5 },
          { stepNumber: 2, instruction: "Tỏi đập dập.", time: 1 },
          { stepNumber: 3, instruction: "Đun nóng dầu ăn, phi thơm tỏi.", time: 2 },
          { stepNumber: 4, instruction: "Cho rau muống vào xào nhanh tay trên lửa lớn.", time: 1 },
          { stepNumber: 5, instruction: "Nêm nếm gia vị vừa ăn, tắt bếp.", time: 1 },
        ],
      },
      ingredients: {
        create: [
          { ingredientId: waterSpinach.id, quantity: 500, unit: "gram" },
          { ingredientId: garlic.id, quantity: 5, unit: "tép" },
          { ingredientId: oil.id, quantity: 2, unit: "muỗng" },
          { ingredientId: salt.id, quantity: 1, unit: "muỗng cafe" },
        ],
      },
      tags: {
        create: [{ tagId: lunchTag.id }, { tagId: dinnerTag.id }, { tagId: stirFriedTag.id }],
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
      userId: user.id,
      steps: {
        create: [
          { stepNumber: 1, instruction: "Nấm rửa sạch, thái miếng vừa ăn.", time: 5 },
          { stepNumber: 2, instruction: "Phi thơm hành lá.", time: 2 },
          { stepNumber: 3, instruction: "Cho nấm vào xào nhanh tay.", time: 5 },
          { stepNumber: 4, instruction: "Nêm gia vị chay, thêm chút tiêu cho thơm.", time: 3 },
        ],
      },
      ingredients: {
        create: [
          { ingredientId: mushroom.id, quantity: 300, unit: "gram" },
          { ingredientId: scallion.id, quantity: 2, unit: "nhánh" },
          { ingredientId: oil.id, quantity: 1, unit: "muỗng" },
          { ingredientId: salt.id, quantity: 1, unit: "muỗng cafe" },
        ],
      },
      tags: {
        create: [{ tagId: vegetarianTag.id }, { tagId: stirFriedTag.id }],
      },
    },
  });

  // Demo cookbooks
  const cookbook1 = await prisma.cookbook.create({
    data: {
      name: "Công thức AI đầu tiên",
      description: "Tập hợp công thức được tạo bởi AI",
      userId: user.id,
      recipes: {
        create: [{ recipeId: recipe1.id }, { recipeId: recipe3.id }]
      }
    },
  });

  const cookbook2 = await prisma.cookbook.create({
    data: {
      name: "Món ngon gia đình",
      description: "Các món ăn quen thuộc hàng ngày",
      userId: user.id,
      recipes: {
        create: [{ recipeId: recipe2.id }, { recipeId: recipe3.id }]
      }
    },
  });

  const cookbook3 = await prisma.cookbook.create({
    data: {
      name: "Thực đơn chay thanh tịnh",
      description: "Tổng hợp các món chay thanh đạm, dễ tiêu",
      userId: user.id,
      recipes: {
        create: [{ recipeId: recipe6.id }]
      }
    },
  });

  const cookbook4 = await prisma.cookbook.create({
    data: {
      name: "Tiệc cuối tuần",
      description: "Các món ngon đãi khách dịp cuối tuần",
      userId: user.id,
      recipes: {
        create: [{ recipeId: recipe2.id }, { recipeId: recipe4.id }]
      }
    },
  });

  console.log("✅ Seed hoàn thành!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
