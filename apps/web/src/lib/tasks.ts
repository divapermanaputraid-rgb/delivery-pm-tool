import { apiRequest } from "@/lib/api";
import type { Task, TaskStatus } from "@/types/task";

export type CreateTaskInput = {
  code: string;
  title: string;
  milestoneId: string;
};

export type UpdateTaskInput = {
  title?: string;
  status?: TaskStatus;
  riskFlag?: boolean;
  milestoneId?: string;
};

export async function listTasks(projectId: string) {
  const data = await apiRequest<{ tasks: Task[] }>(
    `/projects/${encodeURIComponent(projectId)}/tasks`,
  );
  return data.tasks;
}

export async function createTask(projectId: string, input: CreateTaskInput) {
  const data = await apiRequest<{ task: Task }>(
    `/projects/${encodeURIComponent(projectId)}/tasks`,
    {
      method: "POST",
      body: input,
    },
  );
  return data.task;
}

export async function updateTask(
  projectId: string,
  taskId: string,
  input: UpdateTaskInput,
) {
  const data = await apiRequest<{ task: Task }>(
    `/projects/${encodeURIComponent(projectId)}/tasks/${encodeURIComponent(taskId)}`,
    {
      method: "PATCH",
      body: input,
    },
  );
  return data.task;
}

export async function deleteTask(projectId: string, taskId: string) {
  const data = await apiRequest<{ task: Task }>(
    `/projects/${encodeURIComponent(projectId)}/tasks/${encodeURIComponent(taskId)}`,
    {
      method: "DELETE",
    },
  );
  return data.task;
}
