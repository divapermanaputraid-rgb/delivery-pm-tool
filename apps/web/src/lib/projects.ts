import { apiRequest } from "@/lib/api";
import type { Project } from "@/types/project";

export type createProjectInput = {
  name: string;
};

export async function listProjects() {
  const data = await apiRequest<{ projects: Project[] }>("/projects");
  return data.projects;
}

export async function createProject(input: createProjectInput) {
  const data = await apiRequest<{ project: Project }>("/projects", {
    method: "POST",
    body: input,
  });
  return data.project;
}

export async function getProject(projectId: string) {
  const data = await apiRequest<{ project: Project }>(
    `/projects/${encodeURIComponent(projectId)}`,
  );
  return data.project;
}
