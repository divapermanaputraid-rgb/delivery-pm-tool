import { db } from "../../lib/db.js";

type CreateProjectInput = {
  name: string;
};

export async function createProject(input: CreateProjectInput) {
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
