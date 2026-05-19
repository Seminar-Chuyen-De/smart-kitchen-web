import { seedDefaultRecipesForUser } from "../Backend/services/default-recipes";

async function main() {
  const args = process.argv.slice(2);
  const userId = args[0];

  if (!userId) {
    console.error("❌ Lỗi: Vui lòng cung cấp User ID.");
    console.log("👉 Cách sử dụng: npx tsx scripts/seed-recipes-for-user.ts <user_id>");
    console.log("👉 Ví dụ: npx tsx scripts/seed-recipes-for-user.ts user_2gH1A3Xj9z...");
    process.exit(1);
  }

  console.log(`Bắt đầu chạy script seed cho user: ${userId}`);

  try {
    await seedDefaultRecipesForUser(userId);
    console.log("🎉 Script hoàn thành thành công!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Đã xảy ra lỗi trong quá trình seed:", error);
    process.exit(1);
  }
}

main();
