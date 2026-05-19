import { z } from "zod";

export const StepSchema = z.object({
  stepId: z.number().int().positive().optional(),
  recipeId: z.number().int().positive(),
  stepNumber: z.number().int().positive("Step number must be positive"),
  instruction: z.string().min(1, "Instruction cannot be empty"),
  tip: z.string().nullish(),
  time: z.number().int().positive().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateStepSchema = StepSchema.omit({
  stepId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateStepSchema = CreateStepSchema.omit({
  recipeId: true,
}).partial();

export type StepInput = z.infer<typeof StepSchema>;
export type CreateStepInput = z.infer<typeof CreateStepSchema>;
export type UpdateStepInput = z.infer<typeof UpdateStepSchema>;
