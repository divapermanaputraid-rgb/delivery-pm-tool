import { db } from "../../lib/db.js";

export async function createProject(input: { name: string }) {
  return db.project.create({
    data: {
      name: input.name,
    },
  });
}

export async function listRecentProjects(limit = 5) {
  return db.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
}
