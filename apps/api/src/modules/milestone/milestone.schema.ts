import { z } from "zod";

const milestoneNameSchema = z
  .string()
  .trim()
  .min(1, "Milestone name is required")
  .max(200, "Milestone name must be at most 200 characters");

const milestoneDescriptionSchema = z
  .string()
  .trim()
  .max(2000, "Milestone description must be at most 2000 characters");

const milestoneStatusSchema = z.enum(["PLANNED", "ACTIVE", "COMPLETED"]);

const isoDatetimeSchema = z
  .string()
  .datetime({ message: "Must be a valid ISO datetime string" });

export const createMilestoneSchema = z.object({
  name: milestoneNameSchema,
  description: milestoneDescriptionSchema.optional(),
  startDate: isoDatetimeSchema.optional(),
  dueDate: isoDatetimeSchema.optional(),
  status: milestoneStatusSchema.optional(),
});
