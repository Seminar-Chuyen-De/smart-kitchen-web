/**
 * Script: reset-user-recipes.ts
 * Mục đích: Xóa toàn bộ recipe của 1 user và seed lại với đầy đủ steps.
 * Dùng khi: DB có recipes cũ không có steps (migration issue).
 *
 * Cách dùng:
 *   npx tsx scripts/reset-user-recipes.ts <user_id>
 */
import { prisma } from "../backend/db/client";
import { seedDefaultRecipesForUser } from "../backend/services/default-recipes";

async function main() {
  const args = process.argv.slice(2);
  const userId = args[0];

  if (!userId) {
    console.error("❌ Lỗi: Vui lòng cung cấp User ID.");
    console.log("👉 Cách sử dụng: npx tsx scripts/reset-user-recipes.ts <user_id>");
    process.exit(1);
  }

  console.log(`🗑️  Đang xóa toàn bộ recipe của user: ${userId}...`);

  // Xóa tất cả recipes của user (cascade sẽ tự xóa steps, ingredients, tags liên quan)
  const deleted = await prisma.recipe.deleteMany({ where: { userId } });
  console.log(`  ✓ Đã xóa ${deleted.count} recipes.`);

  console.log(`🌱 Đang seed lại recipes với đầy đủ steps...`);
  await seedDefaultRecipesForUser(userId);

  console.log("🎉 Hoàn thành! Refresh trang web để xem kết quả.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Lỗi:", err);
  process.exit(1);
});
