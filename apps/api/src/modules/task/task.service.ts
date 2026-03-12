import { z } from "zod";

import { db } from "../../lib/db.js";
import { createTaskSchema, updateTaskSchema } from "./task.schema.js";

type CreateTaskInput = z.infer<typeof createTaskSchema>;
type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

function toOptionalDate(value?: string) {
  return value ? new Date(value) : undefined;
}

function toPatchDate(value: string | null | undefined) {
  if (value === undefined) {
    return undefined;
  }

  return value === null ? null : new Date(value);
}

export async function createTask(projectId: string, input: CreateTaskInput) {
  return db.task.create({
    data: {
      projectId,
      milestoneId: input.milestoneId?.trim(),
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

export async function updateTaskByIdAndProjectId(
  _projectId: string,
  taskId: string,
  input: UpdateTaskInput,
) {
  const data: {
    code?: string;
    title?: string;
    description?: string | null;
    status?: UpdateTaskInput["status"];
    type?: UpdateTaskInput["type"];
    priority?: string | null;
    discipline?: string | null;
    dueDate?: Date | null;
    startedAt?: Date | null;
    completedAt?: Date | null;
    trackingMode?: UpdateTaskInput["trackingMode"];
    riskFlag?: boolean;
    lastActivityAt?: Date | null;
    milestoneId?: string | null;
  } = {};

  if ("code" in input) {
    data.code = input.code?.trim();
  }
  if ("title" in input) {
    data.title = input.title?.trim();
  }
  if ("description" in input) {
    data.description = input.description;
  }
  if ("status" in input) {
    data.status = input.status;
  }
  if ("type" in input) {
    data.type = input.type;
  }
  if ("priority" in input) {
    data.priority = input.priority;
  }
  if ("discipline" in input) {
    data.discipline = input.discipline;
  }
  if ("dueDate" in input) {
    data.dueDate = toPatchDate(input.dueDate);
  }
  if ("startedAt" in input) {
    data.startedAt = toPatchDate(input.startedAt);
  }
  if ("completedAt" in input) {
    data.completedAt = toPatchDate(input.completedAt);
  }

  if ("trackingMode" in input) {
    data.trackingMode = input.trackingMode;
  }
  if ("riskFlag" in input) {
    data.riskFlag = input.riskFlag;
  }

  if ("lastActivityAt" in input) {
    data.lastActivityAt = toPatchDate(input.lastActivityAt);
  }

  if ("milestoneId" in input) {
    data.milestoneId =
      input.milestoneId === null ? null : input.milestoneId?.trim();
  }

  return db.task.update({
    where: {
      id: taskId,
    },
    data,
  });
}

export async function deleteTaskById(taskId: string) {
  return db.task.delete({
    where: {
      id: taskId,
    },
  });
}
