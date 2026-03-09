import { z } from "zod";

export const projectNameSchema = z
  .string()
  .trim()
  .min(1, "Project name is required")
  .max(120, "Project name must be at most 120 characters");

export const createProjectSchema = z.object({
  name: projectNameSchema,
});

export const updateProjectSchema = z.object({
  name: projectNameSchema,
});
