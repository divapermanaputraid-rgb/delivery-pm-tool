import { z } from "zod";

import { db } from "../../lib/db.js";
import { createTaskSchema } from "./task.schema.js";

type CreateTaskInput = z.infer<typeof createTaskSchema>;

function toOptionalDate(value?: string) {
  return value ? new Date(value) : undefined;
}

export async function createTask(projectId: string, input: CreateTaskInput) {
  return db.task.create({
    data: {
      projectId,
      code: input.code.trim(),
      title: input.title.trim(),
      description: input.description,
      status: input.status,
      type: input.type,
      priority: input.priority,
      discipline: input.discipline,
      dueDate: toOptionalDate(input.dueDate),
      startedAt: toOptionalDate(input.startedAt),
      completedAt: toOptionalDate(input.completedAt),
      trackingMode: input.trackingMode,
      riskFlag: input.riskFlag,
      lastActivityAt: toOptionalDate(input.lastActivityAt),
    },
  });
}

export async function listTasksByProject(projectId: string) {
  return db.task.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getTaskByIdAndProjectId(
  projectId: string,
  taskId: string,
) {
  return db.task.findFirst({
    where: {
      id: taskId,
      projectId,
    },
  });
}
