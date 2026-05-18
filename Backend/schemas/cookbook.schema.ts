import { z } from "zod";

// ================================
// CREATE COOKBOOK
// ================================
export const CreateCookbookSchema = z.object({
  title:       z.string().min(1, "Tên cookbook không được để trống").max(200),
  description: z.string().max(1000).optional(),
  coverImage:  z.string().url("URL ảnh không hợp lệ").optional(),
});

// ================================
// UPDATE COOKBOOK
// ================================
export const UpdateCookbookSchema = CreateCookbookSchema.partial();

// ================================
// TYPES (inferred từ schema)
// ================================
export type CreateCookbookInput = z.infer<typeof CreateCookbookSchema>;
export type UpdateCookbookInput = z.infer<typeof UpdateCookbookSchema>;
