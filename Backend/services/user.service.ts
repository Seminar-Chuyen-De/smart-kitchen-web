import { prisma } from "@/backend/db/client";
import { CreateUserInput, UpdateUserInput } from "@/backend/schemas/user.schema";

export async function upsertUser(data: CreateUserInput) {
  return prisma.user.upsert({
    where: { id: data.id },
    update: {
      email: data.email,
      name: data.name,
      avatarUrl: data.avatarUrl,
    },
    create: data,
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function updateUser(id: string, data: UpdateUserInput) {
  return prisma.user.update({
    where: { id },
    data,
  });
}
