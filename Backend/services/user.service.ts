import { prisma } from "@/backend/db/client";
import { CreateUserInput } from "@/backend/schemas/user.schema";

export async function upsertUser(data: CreateUserInput) {
  return prisma.user.upsert({
    where: { userId: data.userId },
    update: {
      email: data.email,
      username: data.username,
      avatarUrl: data.avatarUrl,
    },
    create: data,
  });
}
