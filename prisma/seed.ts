import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Demo user (Clerk ID placeholder)
  const user = await prisma.user.upsert({
    where: { id: "demo_clerk_user_id" },
    update: {},
    create: {
      id:    "demo_clerk_user_id",
      email: "demo@smartkitchen.vn",
      name:  "Demo User",
    },
  });

  // Demo cookbook
  const cookbook = await prisma.cookbook.upsert({
    where: { id: "clb_demo_001" },
    update: {},
    create: {
      id:          "clb_demo_001",
      title:       "Công thức AI đầu tiên",
      description: "Tập hợp công thức được tạo bởi AI",
      userId:      user.id,
    },
  });

  // Demo recipe
  await prisma.recipe.upsert({
    where: { id: "rec_demo_001" },
    update: {},
    create: {
      id:          "rec_demo_001",
      title:       "Cơm chiên trứng đơn giản",
      description: "Món cơm chiên nhanh, dễ làm với nguyên liệu cơ bản",
      ingredients: ["2 bát cơm nguội", "2 quả trứng", "Hành lá", "Dầu ăn", "Nước mắm", "Muối"],
      instructions: [
        "Đập trứng ra bát, đánh đều.",
        "Đun nóng dầu trong chảo, cho trứng vào xào chín.",
        "Thêm cơm vào, đảo đều với trứng.",
        "Nêm muối và nước mắm, đảo thêm 2 phút.",
        "Cho hành lá vào, tắt bếp và thưởng thức.",
      ],
      cookTime:   15,
      servings:   2,
      source:     "AI_GENERATED",
      userId:     user.id,
      cookbookId: cookbook.id,
    },
  });

  console.log("✅ Seed hoàn thành!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
