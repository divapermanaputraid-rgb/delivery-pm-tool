import { Router } from "express";
import { appConfig } from "../config/app.js";
import { sendSuccess } from "../utils/response.js";

const rootRouter = Router();

rootRouter.get("/", (_req, res) => {
  return sendSuccess(res, {
    name: appConfig.appName,
    version: appConfig.apiVersion,
    status: "running",
  });
});

export default rootRouter;
