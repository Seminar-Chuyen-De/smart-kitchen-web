import { prisma } from "@/backend/db/client";
import { CreateUserInput, UpdateUserInput } from "@/backend/schemas/user.schema";

export async function upsertUser(data: CreateUserInput) {
  return prisma.user.upsert({
    where: { userId: data.userId },
    update: {
      email: data.email,
      username: data.username,
      avatarUrl: data.avatarUrl,
    },
    create: {
      userId: data.userId,
      email: data.email,
      username: data.username,
      avatarUrl: data.avatarUrl,
    },
  });
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { userId },
  });
}

export async function updateUser(userId: string, data: UpdateUserInput) {
  return prisma.user.update({
    where: { userId },
    data,
  });
}
