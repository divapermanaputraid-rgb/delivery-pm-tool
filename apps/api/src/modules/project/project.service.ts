import { db } from "../../lib/db.js";

type ProjectNameInput = {
  name: string;
};

export async function createProject(input: ProjectNameInput) {
  return db.project.create({
    data: {
      name: input.name.trim(),
    },
  });
}

export async function listProjects(limit?: number) {
  return db.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
    ...(limit !== undefined ? { take: limit } : {}),
  });
}

export async function getProjectById(projectId: string) {
  return db.project.findUnique({
    where: {
      id: projectId,
    },
  });
}

export async function updateProject(
  projectId: string,
  input: ProjectNameInput,
) {
  return db.project.update({
    where: {
      id: projectId,
    },
    data: {
      name: input.name.trim(),
    },
  });
}

export async function deleteProject(projectId: string) {
  return db.project.delete({
    where: {
      id: projectId,
    },
  });
}
