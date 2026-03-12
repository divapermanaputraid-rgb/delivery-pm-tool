import { z } from "zod";

const taskCodeSchema = z
  .string()
  .trim()
  .min(1, "Task code is required")
  .max(50, "Task code must be at most 50 characters");

const taskTitleSchema = z
  .string()
  .trim()
  .min(1, "Task title is required")
  .max(200, "Task title must be at most 200 characters");

const taskDescriptionSchema = z
  .string()
  .trim()
  .max(2000, "Task description must be at most 2000 characters");

const taskMilestoneIdSchema = z
  .string()
  .trim()
  .min(1, "Milestone id is required");

const taskStatusSchema = z.enum([
  "BACKLOG",
  "READY",
  "IN_PROGRESS",
  "IN_REVIEW",
  "BLOCKED",
  "DONE",
]);

const taskTypeSchema = z.enum(["FEATURE", "BUG", "IMPROVEMENT", "TASK"]);

const taskTrackingModeSchema = z.enum(["MANUAL", "CODE_LINKED"]);
const optionalTrimmedString = (fieldLabel: string, maxLength: number) =>
  z
    .string()
    .trim()
    .min(1, `${fieldLabel} is required`)
    .max(maxLength, `${fieldLabel} must be at most ${maxLength} characters`);

const isoDatetimeSchema = z
  .string()
  .datetime({ message: "Must be a valid ISO datetime string" });

export const createTaskSchema = z.object({
  code: taskCodeSchema,
  title: taskTitleSchema,
  description: taskDescriptionSchema.optional(),
  status: taskStatusSchema.optional(),
  type: taskTypeSchema.optional(),
  priority: optionalTrimmedString("Task priority", 50).optional(),
  discipline: optionalTrimmedString("Task discipline", 50).optional(),
  dueDate: isoDatetimeSchema.optional(),
  startedAt: isoDatetimeSchema.optional(),
  completedAt: isoDatetimeSchema.optional(),
  trackingMode: taskTrackingModeSchema.optional(),
  riskFlag: z.boolean().optional(),
  lastActivityAt: isoDatetimeSchema.optional(),
  milestoneId: taskMilestoneIdSchema.optional(),
});

export const updateTaskSchema = z
  .object({
    code: taskCodeSchema.optional(),
    title: taskTitleSchema.optional(),
    description: taskDescriptionSchema.nullable().optional(),
    status: taskStatusSchema.optional(),
    type: taskTypeSchema.optional(),
    priority: optionalTrimmedString("Task priority", 50).nullable().optional(),
    discipline: optionalTrimmedString("Task discipline", 50)
      .nullable()
      .optional(),
    dueDate: isoDatetimeSchema.nullable().optional(),
    startedAt: isoDatetimeSchema.nullable().optional(),
    completedAt: isoDatetimeSchema.nullable().optional(),
    trackingMode: taskTrackingModeSchema.optional(),
    riskFlag: z.boolean().optional(),
    lastActivityAt: isoDatetimeSchema.nullable().optional(),
    milestoneId: taskMilestoneIdSchema.nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
    path: [],
  });
