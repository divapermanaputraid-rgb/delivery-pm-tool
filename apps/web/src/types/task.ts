export type TaskStatus =
  | "BACKLOG"
  | "READY"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "BLOCKED"
  | "DONE";

export type TaskType = "FEATURE" | "BUG" | "IMPROVEMENT" | "TASK";

export type TaskTrackingMode = "MANUAL" | "CODE_LINKED";

export type Task = {
  id: string;
  projectId: string;
  milestoneId: string | null;
  code: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  type: TaskType;
  priority: string | null;
  discipline: string | null;
  dueDate: string | null;
  startedAt: string | null;
  completedAt: string | null;
  trackingMode: TaskTrackingMode;
  riskFlag: boolean;
  lastActivityAt: string | null;
  createdAt: string;
  updatedAt: string;
};
