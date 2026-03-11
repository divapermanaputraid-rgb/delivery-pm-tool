import { z } from "zod";

import { db } from "../../lib/db.js";
import { createMilestoneSchema } from "./milestone.schema.js";

type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;

function toOptionalDate(value?: string) {
  return value ? new Date(value) : undefined;
}

export async function createMilestone(
  projectId: string,
  input: CreateMilestoneInput,
) {
  return db.milestone.create({
    data: {
      projectId,
      name: input.name.trim(),
      description: input.description,
      startDate: toOptionalDate(input.startDate),
      dueDate: toOptionalDate(input.dueDate),
      status: input.status,
    },
  });
}

export async function listMilestonesByProject(projectId: string) {
  return db.milestone.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getMilestoneByIdAndProjectId(
  projectId: string,
  milestoneId: string,
) {
  return db.milestone.findFirst({
    where: {
      id: milestoneId,
      projectId,
    },
  });
}
