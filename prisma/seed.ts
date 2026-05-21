import { PrismaClient } from "@prisma/client";
import { seedDefaultRecipesForUser } from "./../Backend/services/default-recipes";

const prisma = new PrismaClient();

async function getOrCreateIngredient(name: string, icon: string) {
  let ing = await prisma.ingredient.findFirst({
    where: { name: { equals: name, mode: "insensitive" } }
  });
  if (!ing) {
    ing = await prisma.ingredient.create({
      data: { name, icon, bgColor: "#F5F5F5" }
    });
  }
  return ing;
}

async function getOrCreateTag(name: string, category: string, emoji: string) {
  let tag = await prisma.tag.findFirst({
    where: { name: { equals: name, mode: "insensitive" } }
  });
  if (!tag) {
    tag = await prisma.tag.create({
      data: { name, category, emoji }
    });
  }
  return tag;
}

async function main() {
  console.log("🌱 Seeding database...");

  // Demo user
  const user = await prisma.user.upsert({
    where: { userId: "demo_clerk_user_id" },
    update: {},
    create: {
      userId: "demo_clerk_user_id",
      email: "demo@smartkitchen.vn",
      username: "Demo User",
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
  const egg = await getOrCreateIngredient("Trứng", "🥚");
  const rice = await getOrCreateIngredient("Cơm nguội", "🍚");
  const oil = await getOrCreateIngredient("Dầu ăn", "🛢️");
  const pork = await getOrCreateIngredient("Thịt heo", "🥩");
  const chicken = await getOrCreateIngredient("Thịt gà", "🍗");
  const tomato = await getOrCreateIngredient("Cà chua", "🍅");
  const onion = await getOrCreateIngredient("Hành tây", "🧅");
  const garlic = await getOrCreateIngredient("Tỏi", "🧄");
  const fishSauce = await getOrCreateIngredient("Nước mắm", "🍶");
  const sugar = await getOrCreateIngredient("Đường", "🧂");
  const beef = await getOrCreateIngredient("Thịt bò", "🥩");
  const shrimp = await getOrCreateIngredient("Tôm", "🍤");
  const waterSpinach = await getOrCreateIngredient("Rau muống", "🥬");
  const potato = await getOrCreateIngredient("Khoai tây", "🥔");
  const carrot = await getOrCreateIngredient("Cà rốt", "🥕");
  const mushroom = await getOrCreateIngredient("Nấm", "🍄");
  const ginger = await getOrCreateIngredient("Gừng", "🫚");
  const scallion = await getOrCreateIngredient("Hành lá", "🌿");
  const salt = await getOrCreateIngredient("Muối", "🧂");
  const pepper = await getOrCreateIngredient("Tiêu", "🧂");

  // Demo tags
  const breakfastTag = await getOrCreateTag("Bữa sáng", "Bữa ăn", "🌅");
  const lunchTag = await getOrCreateTag("Bữa trưa", "Bữa ăn", "☀️");
  const dinnerTag = await getOrCreateTag("Bữa tối", "Bữa ăn", "🌙");
  const mainDishTag = await getOrCreateTag("Món mặn", "Loại món", "🥘");
  const soupTag = await getOrCreateTag("Món canh", "Loại món", "🥣");
  const vegetarianTag = await getOrCreateTag("Món chay", "Loại món", "🥗");
  const grilledTag = await getOrCreateTag("Món nướng", "Loại món", "🍢");
  const stirFriedTag = await getOrCreateTag("Món xào", "Loại món", "🍳");
  const snackTag = await getOrCreateTag("Ăn vặt", "Loại món", "🍟");

  // Demo recipes
  const recipe1 = await prisma.recipe.create({
    data: {
      recipesName: "Cơm chiên trứng đơn giản",
      description: "Món cơm chiên nhanh, dễ làm với nguyên liệu cơ bản",
      imageRecipe: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80",
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
      imageRecipe: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80",
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
      imageRecipe: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
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
      imageRecipe: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
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
      imageRecipe: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
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
      imageRecipe: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80",
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
  const recipe7 = await prisma.recipe.create({
    data: {
      recipesName: "Bò lúc lắc 1",
      description: "Thịt bò mềm ngọt xào cùng ớt chuông và hành tây",
      imageRecipe: "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80",
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

  // Seed the 10 recommended recipes for the demo user
  await seedDefaultRecipesForUser(user.userId);

  // Demo cookbooks
  await prisma.cookbook.create({
    data: {
      name: "Công thức AI đầu tiên",
      userId: user.userId,
      cookbookRecipes: {
        create: [{ recipeId: recipe1.recipeId }, { recipeId: recipe3.recipeId }]
      }
    },
  });

  await prisma.cookbook.create({
    data: {
      name: "Món ngon gia đình",
      userId: user.userId,
      cookbookRecipes: {
        create: [{ recipeId: recipe2.recipeId }, { recipeId: recipe3.recipeId }]
      }
    },
  });

  await prisma.cookbook.create({
    data: {
      name: "Thực đơn chay thanh tịnh",
      userId: user.userId,
      cookbookRecipes: {
        create: [{ recipeId: recipe6.recipeId }]
      }
    },
  });

  await prisma.cookbook.create({
    data: {
      name: "Tiệc cuối tuần",
      userId: user.userId,
      cookbookRecipes: {
        create: [{ recipeId: recipe2.recipeId }, { recipeId: recipe4.recipeId }]
      }
    },
  });

  // Cập nhật hình ảnh cho các công thức cũ của mọi người dùng nếu chưa có ảnh
  console.log("🔄 Cập nhật hình ảnh cho các công thức cũ trong Database...");
  const RECIPE_IMAGE_MAP: Record<string, string> = {
    "Phở Bò truyền thống": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80",
    "Bún Chả Hà Nội": "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80",
    "Gỏi Cuốn Tôm Thịt": "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80",
    "Bánh Mì kẹp thịt Việt Nam": "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80",
    "Cơm Tấm sườn bì chả": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
    "Bún Bò Huế": "https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80",
    "Cá Kho Tộ truyền thống": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    "Bánh Xèo Nam Bộ": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
    "Canh Chua Cá Lóc": "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
    "Thịt Kho Tàu nước dừa": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80",
    "Thịt kho tàu": "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80",
    "Cơm chiên trứng đơn giản": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80",
    "Canh cà chua trứng": "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
    "Bò lúc lắc": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    "Rau muống xào tỏi": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
    "Nấm xào chay": "https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80",
    "Bò lúc lắc 1": "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80",
  };

  for (const [name, url] of Object.entries(RECIPE_IMAGE_MAP)) {
    const result = await prisma.recipe.updateMany({
      where: {
        recipesName: { equals: name, mode: "insensitive" },
        OR: [
          { imageRecipe: null },
          { imageRecipe: "" }
        ]
      },
      data: {
        imageRecipe: url
      }
    });
    if (result.count > 0) {
      console.log(`  ✓ Đã cập nhật ảnh cho ${result.count} công thức "${name}"`);
    }
  }

  console.log("✅ Seed database thành công với recipe ID:", recipe1.recipeId);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
