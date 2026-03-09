import { Router } from "express";

import { AppError } from "../../errors/app-error.js";
import { validateRequest } from "../../middlewares/validate-request.middleware.js";
import { sendSuccess } from "../../utils/response.js";
import { createProjectSchema, updateProjectSchema } from "./project.schema.js";
import {
  createProject,
  getProjectById,
  listProjects,
  updateProject,
} from "./project.service.js";

const projectRouter = Router();

projectRouter.get("/", async (_req, res, next) => {
  try {
    const projects = await listProjects();

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
    const projectId = Array.isArray(req.params.projectId)
      ? req.params.projectId[0]
      : req.params.projectId;

    const project = await getProjectById(projectId);

    if (!project) {
      return next(
        new AppError({
          code: "PROJECT_NOT_FOUND",
          message: `Project with id ${projectId} not found`,
          statusCode: 404,
        }),
      );
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
      const projectId = Array.isArray(req.params.projectId)
        ? req.params.projectId[0]
        : req.params.projectId;

      const existingProject = await getProjectById(projectId);

      if (!existingProject) {
        return next(
          new AppError({
            code: "PROJECT_NOT_FOUND",
            message: `Project with id ${projectId} not found`,
            statusCode: 404,
          }),
        );
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

export { projectRouter };
