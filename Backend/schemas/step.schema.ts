import { z } from "zod";

export const CreateStepSchema = z.object({
  stepNumber: z.number().int().positive(),
  instruction: z.string().min(1, "Hướng dẫn không được để trống"),
  tip: z.string().optional(),
  time: z.number().int().positive().optional(),
});

export const UpdateStepSchema = CreateStepSchema.partial();
export type CreateStepInput = z.infer<typeof CreateStepSchema>;
export type UpdateStepInput = z.infer<typeof UpdateStepSchema>;
