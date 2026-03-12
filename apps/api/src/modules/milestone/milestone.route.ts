import { Router, type RequestHandler } from "express";
import { z } from "zod";

import { AppError } from "../../errors/app-error.js";
import { validateRequest } from "../../middlewares/validate-request.middleware.js";
import { sendSuccess } from "../../utils/response.js";
import { getProjectById } from "../project/project.service.js";
import {
  createMilestoneSchema,
  updateMilestoneSchema,
} from "./milestone.schema.js";
import {
  createMilestone,
  deleteMilestoneById,
  getMilestoneByIdAndProjectId,
  listMilestonesByProject,
  updateMilestoneByIdAndProjectId,
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
type UpdateMilestoneBody = z.infer<typeof updateMilestoneSchema>;

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

const updateMilestoneHandler: RequestHandler<
  MilestoneDetailRouteParams,
  unknown,
  UpdateMilestoneBody
> = async (req, res, next) => {
  try {
    const { projectId, milestoneId } = req.params;
    const project = await getProjectById(projectId);

    if (!project) {
      return next(buildProjectNotFoundError(projectId));
    }
    const existingMilestone = await getMilestoneByIdAndProjectId(
      projectId,
      milestoneId,
    );
    if (!existingMilestone) {
      return next(buildMilestoneNotFoundError(projectId, milestoneId));
    }

    const milestone = await updateMilestoneByIdAndProjectId(
      projectId,
      milestoneId,
      req.body,
    );

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

const deleteMilestoneHandler: RequestHandler<
  MilestoneDetailRouteParams
> = async (req, res, next) => {
  try {
    const { projectId, milestoneId } = req.params;
    const project = await getProjectById(projectId);

    if (!project) {
      return next(buildProjectNotFoundError(projectId));
    }
    const existingMilestone = await getMilestoneByIdAndProjectId(
      projectId,
      milestoneId,
    );
    if (!existingMilestone) {
      return next(buildMilestoneNotFoundError(projectId, milestoneId));
    }
    const milestone = await deleteMilestoneById(milestoneId);

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
milestoneRouter.patch(
  "/:milestoneId",
  validateRequest(updateMilestoneSchema),
  updateMilestoneHandler,
);
milestoneRouter.delete("/:milestoneId", deleteMilestoneHandler);

export { milestoneRouter };
