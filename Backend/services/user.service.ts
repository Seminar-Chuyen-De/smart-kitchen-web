import { prisma } from "@/backend/db/client";
import { CreateUserInput } from "@/backend/schemas/user.schema";
import { seedDefaultRecipesForUser } from "./default-recipes";

export async function upsertUser(data: CreateUserInput) {
  const existing = await prisma.user.findUnique({
    where: { userId: data.userId },
  });

  const user = await prisma.user.upsert({
    where: { userId: data.userId },
    update: {
      email: data.email,
      username: data.username,
      avatarUrl: data.avatarUrl,
    },
    create: data,
  });

  if (!existing) {
    try {
      await seedDefaultRecipesForUser(data.userId);
    } catch (err) {
      console.error(`Failed to auto-seed default recipes for new user ${data.userId}:`, err);
    }
  }

  return user;
}
