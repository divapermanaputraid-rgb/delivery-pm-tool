import { Router, type RequestHandler } from "express";
import { z } from "zod";

import { AppError } from "../../errors/app-error.js";
import { validateRequest } from "../../middlewares/validate-request.middleware.js";
import { sendSuccess } from "../../utils/response.js";
import { getProjectById } from "../project/project.service.js";
import { getMilestoneByIdAndProjectId } from "../milestone/milestone.service.js";
import { createTaskSchema, updateTaskSchema } from "./task.schema.js";
import {
  createTask,
  deleteTaskById,
  getTaskByIdAndProjectId,
  listTasksByProject,
  updateTaskByIdAndProjectId,
} from "./task.service.js";

const taskRouter = Router({ mergeParams: true });

type TaskRouteParams = {
  projectId: string;
};

type TaskDetailRouteParams = {
  projectId: string;
  taskId: string;
};

type CreateTaskBody = z.infer<typeof createTaskSchema>;

type UpdateTaskBody = z.infer<typeof updateTaskSchema>;

function buildProjectNotFoundError(projectId: string) {
  return new AppError({
    code: "PROJECT_NOT_FOUND",
    message: `Project with id ${projectId} not found`,
    statusCode: 404,
  });
}

function isUniqueConstraintError(error: unknown): error is {
  code: string;
  meta?: { target?: unknown };
} {
  if (typeof error !== "object" || error === null) {
    return false;
  }
  return "code" in error && error.code === "P2002";
}

function buildTaskCodeAlreadyExistsError(taskCode: string) {
  return new AppError({
    code: "TASK_CODE_ALREADY_EXISTS",
    message: `Task code ${taskCode} already exists in this project`,
    statusCode: 409,
  });
}

function buildTaskNotFoundError(projectId: string, taskId: string) {
  return new AppError({
    code: "TASK_NOT_FOUND",
    message: `Task with id ${taskId} not found in project ${projectId}`,
    statusCode: 404,
  });
}

function buildMilestoneNotFoundError(projectId: string, milestoneId: string) {
  return new AppError({
    code: "MILESTONE_NOT_FOUND",
    message: `Milestone with id ${milestoneId} not found in project ${projectId}`,
    statusCode: 404,
  });
}

const listTasksHandler: RequestHandler<TaskRouteParams> = async (
  req,
  res,
  next,
) => {
  try {
    const projectId = req.params.projectId;
    const project = await getProjectById(projectId);

    if (!project) {
      return next(buildProjectNotFoundError(projectId));
    }
    const tasks = await listTasksByProject(projectId);

    return sendSuccess(
      res,
      {
        tasks,
      },
      {
        statusCode: 200,
      },
    );
  } catch (error) {
    next(error);
  }
};

const getTaskDetailHandler: RequestHandler<TaskDetailRouteParams> = async (
  req,
  res,
  next,
) => {
  try {
    const { projectId, taskId } = req.params;
    const project = await getProjectById(projectId);

    if (!project) {
      return next(buildProjectNotFoundError(projectId));
    }

    const task = await getTaskByIdAndProjectId(projectId, taskId);

    if (!task) {
      return next(buildTaskNotFoundError(projectId, taskId));
    }
    return sendSuccess(
      res,
      {
        task,
      },
      {
        statusCode: 200,
      },
    );
  } catch (error) {
    next(error);
  }
};

const updateTaskHandler: RequestHandler<
  TaskDetailRouteParams,
  unknown,
  UpdateTaskBody
> = async (req, res, next) => {
  try {
    const { projectId, taskId } = req.params;
    const project = await getProjectById(projectId);

    if (!project) {
      return next(buildProjectNotFoundError(projectId));
    }

    const existingTask = await getTaskByIdAndProjectId(projectId, taskId);

    if (!existingTask) {
      return next(buildTaskNotFoundError(projectId, taskId));
    }

    if (req.body.milestoneId !== undefined && req.body.milestoneId !== null) {
      const milestone = await getMilestoneByIdAndProjectId(
        projectId,
        req.body.milestoneId,
      );
      if (!milestone) {
        return next(
          buildMilestoneNotFoundError(projectId, req.body.milestoneId),
        );
      }
    }

    const task = await updateTaskByIdAndProjectId(projectId, taskId, req.body);
    return sendSuccess(
      res,
      {
        task,
      },
      {
        statusCode: 200,
      },
    );
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return next(buildTaskCodeAlreadyExistsError(req.body.code ?? "unknown"));
    }
    next(error);
  }
};

const createTaskHandler: RequestHandler<
  TaskRouteParams,
  unknown,
  CreateTaskBody
> = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const project = await getProjectById(projectId);

    if (!project) {
      return next(buildProjectNotFoundError(projectId));
    }

    if (req.body.milestoneId !== undefined) {
      const milestone = await getMilestoneByIdAndProjectId(
        projectId,
        req.body.milestoneId,
      );

      if (!milestone) {
        return next(
          buildMilestoneNotFoundError(projectId, req.body.milestoneId),
        );
      }
    }

    const task = await createTask(projectId, req.body);

    return sendSuccess(
      res,
      {
        task,
      },
      {
        statusCode: 201,
      },
    );
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return next(buildTaskCodeAlreadyExistsError(req.body.code));
    }
    next(error);
  }
};

const deleteTaskHandler: RequestHandler<TaskDetailRouteParams> = async (
  req,
  res,
  next,
) => {
  try {
    const { projectId, taskId } = req.params;
    const project = await getProjectById(projectId);

    if (!project) {
      return next(buildProjectNotFoundError(projectId));
    }

    const existingTask = await getTaskByIdAndProjectId(projectId, taskId);

    if (!existingTask) {
      return next(buildTaskNotFoundError(projectId, taskId));
    }

    const task = await deleteTaskById(taskId);

    return sendSuccess(
      res,
      {
        task,
      },
      {
        statusCode: 200,
      },
    );
  } catch (error) {
    next(error);
  }
};

taskRouter.get("/", listTasksHandler);
taskRouter.get("/:taskId", getTaskDetailHandler);
taskRouter.post("/", validateRequest(createTaskSchema), createTaskHandler);
taskRouter.patch(
  "/:taskId",
  validateRequest(updateTaskSchema),
  updateTaskHandler,
);
taskRouter.delete("/:taskId", deleteTaskHandler);
export { taskRouter };
