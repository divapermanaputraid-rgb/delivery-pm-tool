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

export async function listProjects() {
  return db.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
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
