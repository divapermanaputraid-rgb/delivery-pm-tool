export type MilestoneStatus = "PLANNED" | "ACTIVE" | "COMPLETED";

export type Milestone = {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  startDate: string;
  dueDate: string;
  status: MilestoneStatus;
  createdAt: string;
  updatedAt: string;
};
