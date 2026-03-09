import { Router } from "express";

import { AppError } from "../../errors/app-error.js";
import { validateRequest } from "../../middlewares/validate-request.middleware.js";
import { sendSuccess } from "../../utils/response.js";
import { createProjectSchema } from "./project.schema.js";
import {
  createProject,
  getProjectById,
  listProjects,
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
    const project = await getProjectById(req.params.projectId);

    if (!project) {
      return next(
        new AppError({
          code: "PROJECT_NOT_FOUND",
          message: `Project with id ${req.params.projectId} not found`,
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
export { projectRouter };
