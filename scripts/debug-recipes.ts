/**
 * Script: debug-recipes.ts
 * Kiểm tra dữ liệu recipe trong DB, đặc biệt là steps và ingredients
 * Cách dùng: npx tsx scripts/debug-recipes.ts
 */
import { prisma } from "../backend/db/client";

async function main() {
  console.log("🔍 Checking recipes in DB...\n");

  const users = await prisma.user.findMany({
    select: { userId: true, email: true, username: true },
  });

  console.log(`Found ${users.length} users:`);
  for (const u of users) {
    console.log(`  - ${u.userId} (${u.email})`);
  }

  if (users.length === 0) {
    console.log("No users found. Exiting.");
    process.exit(0);
  }

  // Kiểm tra recipe đầu tiên có steps không
  const recipesWithSteps = await prisma.recipe.findMany({
    include: {
      steps: true,
      recipeIngredients: { include: { ingredient: true } },
    },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  console.log(`\n📋 Latest 5 recipes:`);
  for (const r of recipesWithSteps) {
    console.log(`  - [${r.recipeId}] "${r.recipesName}" | steps: ${r.steps.length} | ingredients: ${r.recipeIngredients.length} | sourceType: ${r.sourceType}`);
    if (r.steps.length > 0) {
      console.log(`    Steps[0]: ${r.steps[0]?.instruction?.substring(0, 50)}...`);
    }
  }

  // Tổng hợp
  const totalRecipes = await prisma.recipe.count();
  const totalSteps = await prisma.step.count();
  const recipesWith0Steps = await prisma.recipe.count({ where: { steps: { none: {} } } });

  console.log(`\n📊 Summary:`);
  console.log(`  Total recipes: ${totalRecipes}`);
  console.log(`  Total steps: ${totalSteps}`);
  console.log(`  Recipes with 0 steps: ${recipesWith0Steps}`);
  console.log(`  Recipes with steps: ${totalRecipes - recipesWith0Steps}`);

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
