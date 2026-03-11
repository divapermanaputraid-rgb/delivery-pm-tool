import { Router, type RequestHandler } from "express";
import { z } from "zod";

import { AppError } from "../../errors/app-error.js";
import { validateRequest } from "../../middlewares/validate-request.middleware.js";
import { sendSuccess } from "../../utils/response.js";
import { getProjectById } from "../project/project.service.js";
import { createMilestoneSchema } from "./milestone.schema.js";
import {
  createMilestone,
  getMilestoneByIdAndProjectId,
  listMilestonesByProject,
} from "./milestone.service.js";

const milestoneRouter = Router({ mergeParams: true });

type MilestoneRouteParams = {
  projectId: string;
};

type MilestoneDetailRouteParams = {
  projectId: string;
  milestoneId: string;
};

type CreateMilestoneBody = z.infer<typeof createMilestoneSchema>;

function buildProjectNotFoundError(projectId: string) {
  return new AppError({
    code: "PROJECT_NOT_FOUND",
    message: `Project with id ${projectId} not found`,
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

const listMilestonesHandler: RequestHandler<MilestoneRouteParams> = async (
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

    const milestones = await listMilestonesByProject(projectId);
    return sendSuccess(
      res,
      {
        milestones,
      },
      {
        statusCode: 200,
      },
    );
  } catch (error) {
    next(error);
  }
};

const getMilestoneDetailHandler: RequestHandler<
  MilestoneDetailRouteParams
> = async (req, res, next) => {
  try {
    const { projectId, milestoneId } = req.params;
    const project = await getProjectById(projectId);
    if (!project) {
      return next(buildProjectNotFoundError(projectId));
    }

    const milestone = await getMilestoneByIdAndProjectId(
      projectId,
      milestoneId,
    );

    if (!milestone) {
      return next(buildMilestoneNotFoundError(projectId, milestoneId));
    }
    return sendSuccess(
      res,
      {
        milestone,
      },
      {
        statusCode: 200,
      },
    );
  } catch (error) {
    next(error);
  }
};

const createMilestoneHandler: RequestHandler<
  MilestoneRouteParams,
  unknown,
  CreateMilestoneBody
> = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const project = await getProjectById(projectId);
    if (!project) {
      return next(buildProjectNotFoundError(projectId));
    }
    const milestone = await createMilestone(projectId, req.body);

    return sendSuccess(
      res,
      {
        milestone,
      },
      {
        statusCode: 201,
      },
    );
  } catch (error) {
    next(error);
  }
};

milestoneRouter.get("/", listMilestonesHandler);
milestoneRouter.get("/:milestoneId", getMilestoneDetailHandler);
milestoneRouter.post(
  "/",
  validateRequest(createMilestoneSchema),
  createMilestoneHandler,
);

export { milestoneRouter };
