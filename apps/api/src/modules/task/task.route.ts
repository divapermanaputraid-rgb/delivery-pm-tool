import { Router, type RequestHandler } from "express";
import { z } from "zod";

import { AppError } from "../../errors/app-error.js";
import { validateRequest } from "../../middlewares/validate-request.middleware.js";
import { sendSuccess } from "../../utils/response.js";
import { getProjectById } from "../project/project.service.js";
import { createTaskSchema } from "./task.schema.js";
import { createTask, listTasksByProject } from "./task.service.js";

const taskRouter = Router({ mergeParams: true });

type TaskRouteParams = {
  projectId: string;
};

type CreateTaskBody = z.infer<typeof createTaskSchema>;

function buildProjectNotFoundError(projectId: string) {
  return new AppError({
    code: "PROJECT_NOT_FOUND",
    message: `Project with id ${projectId} not found`,
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
    next(error);
  }
};

taskRouter.get("/", listTasksHandler);
taskRouter.post("/", validateRequest(createTaskSchema), createTaskHandler);

export { taskRouter };
