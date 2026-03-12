import { z } from "zod";

import { db } from "../../lib/db.js";
import {
  createMilestoneSchema,
  updateMilestoneSchema,
} from "./milestone.schema.js";

type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;
type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;

function toOptionalDate(value?: string) {
  return value ? new Date(value) : undefined;
}

function toPatchDate(value: string | null | undefined) {
  if (value === undefined) {
    return undefined;
  }

  return value === null ? null : new Date(value);
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

export async function updateMilestoneByIdAndProjectId(
  _projectId: string,
  milestoneId: string,
  input: UpdateMilestoneInput,
) {
  const data: {
    name?: string;
    description?: string | null;
    startDate?: Date | null;
    dueDate?: Date | null;
    status?: UpdateMilestoneInput["status"];
  } = {};

  if ("name" in input) {
    data.name = input.name?.trim();
  }

  if ("description" in input) {
    data.description = input.description;
  }

  if ("startDate" in input) {
    data.startDate = toPatchDate(input.startDate);
  }

  if ("dueDate" in input) {
    data.dueDate = toPatchDate(input.dueDate);
  }

  if ("status" in input) {
    data.status = input.status;
  }

  return db.milestone.update({
    where: {
      id: milestoneId,
    },
    data,
  });
}

export async function deleteMilestoneById(milestoneId: string) {
  return db.milestone.delete({
    where: {
      id: milestoneId,
    },
  });
}
