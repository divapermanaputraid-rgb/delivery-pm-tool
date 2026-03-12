import { apiRequest } from "@/lib/api";
import { Milestone, MilestoneStatus } from "@/types/milestone";

export type CreateMilestoneInput = {
  name: string;
  status?: MilestoneStatus;
};

export type UpdateMilestoneInput = {
  name?: string;
  status?: MilestoneStatus;
};

export async function listMilestones(projectId: string) {
  const data = await apiRequest<{ milestones: Milestone[] }>(
    `/projects/${encodeURIComponent(projectId)}/milestones`,
  );
  return data.milestones;
}

export async function createMilestone(
  projectId: string,
  input: CreateMilestoneInput,
) {
  const data = await apiRequest<{ milestone: Milestone }>(
    `/projects/${encodeURIComponent(projectId)}/milestones`,
    {
      method: "POST",
      body: input,
    },
  );

  return data.milestone;
}

export async function updateMilestone(
  projectId: string,
  milestoneId: string,
  input: UpdateMilestoneInput,
) {
  const data = await apiRequest<{ milestone: Milestone }>(
    `/projects/${encodeURIComponent(projectId)}/milestones/${encodeURIComponent(milestoneId)}`,
    {
      method: "PATCH",
      body: input,
    },
  );

  return data.milestone;
}

export async function deleteMilestone(projectId: string, milestoneId: string) {
  const data = await apiRequest<{ milestone: Milestone }>(
    `/projects/${encodeURIComponent(projectId)}/milestones/${encodeURIComponent(milestoneId)}`,
    {
      method: "DELETE",
    },
  );

  return data.milestone;
}
