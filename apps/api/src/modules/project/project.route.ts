import { Router } from "express";

import { AppError } from "../../errors/app-error.js";
import { validateRequest } from "../../middlewares/validate-request.middleware.js";
import { sendSuccess } from "../../utils/response.js";
import { createProjectSchema, updateProjectSchema } from "./project.schema.js";
import {
  createProject,
  deleteProject,
  getProjectById,
  listProjects,
  updateProject,
} from "./project.service.js";

import { taskRouter } from "../task/task.route.js";

const projectRouter = Router();

function getProjectIdParam(projectIdParam: string | string[]) {
  return Array.isArray(projectIdParam) ? projectIdParam[0] : projectIdParam;
}

function buildProjectNotFoundError(projectId: string) {
  return new AppError({
    code: "PROJECT_NOT_FOUND",
    message: `Project with id ${projectId} not found`,
    statusCode: 404,
  });
}

function getSingleQueryParam(value: unknown) {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0];
  }
  return undefined;
}

function parseLimitQuery(limitValue: unknown) {
  const rawLimit = getSingleQueryParam(limitValue);

  if (rawLimit === undefined) {
    return undefined;
  }

  const limit = Number(rawLimit);

  if (!Number.isInteger(limit) || limit <= 0) {
    throw new AppError({
      code: "VALIDATION_ERROR",
      message: "Request validation failed",
      statusCode: 400,
      meta: {
        details: [
          {
            field: "limit",
            message: "Limit must be a positive integer",
          },
        ],
      },
    });
  }
  return Math.min(limit, 100);
}

projectRouter.use("/:projectId/tasks", taskRouter);

projectRouter.get("/", async (req, res, next) => {
  try {
    const limit = parseLimitQuery(req.query.limit);
    const projects = await listProjects(limit);

    return sendSuccess(
      res,
      {
        projects,
      },
      {
        statusCode: 200,
      },
    );
  } catch (error) {
    next(error);
  }
});

projectRouter.get("/:projectId", async (req, res, next) => {
  try {
    const projectId = getProjectIdParam(req.params.projectId);
    const project = await getProjectById(projectId);

    if (!project) {
      return next(buildProjectNotFoundError(projectId));
    }

    return sendSuccess(
      res,
      {
        project,
      },
      {
        statusCode: 200,
      },
    );
  } catch (error) {
    next(error);
  }
});

projectRouter.post(
  "/",
  validateRequest(createProjectSchema),
  async (req, res, next) => {
    try {
      const project = await createProject(req.body);

      return sendSuccess(
        res,
        {
          project,
        },
        {
          statusCode: 201,
        },
      );
    } catch (error) {
      next(error);
    }
  },
);

projectRouter.patch(
  "/:projectId",
  validateRequest(updateProjectSchema),
  async (req, res, next) => {
    try {
      const projectId = getProjectIdParam(req.params.projectId);
      const existingProject = await getProjectById(projectId);

      if (!existingProject) {
        return next(buildProjectNotFoundError(projectId));
      }

      const project = await updateProject(projectId, req.body);

      return sendSuccess(
        res,
        {
          project,
        },
        {
          statusCode: 200,
        },
      );
    } catch (error) {
      next(error);
    }
  },
);

projectRouter.delete("/:projectId", async (req, res, next) => {
  try {
    const projectId = getProjectIdParam(req.params.projectId);
    const existingProject = await getProjectById(projectId);

    if (!existingProject) {
      return next(buildProjectNotFoundError(projectId));
    }
    const project = await deleteProject(projectId);

    return sendSuccess(
      res,
      {
        project,
      },
      {
        statusCode: 200,
      },
    );
  } catch (error) {
    next(error);
  }
});

export { projectRouter };
