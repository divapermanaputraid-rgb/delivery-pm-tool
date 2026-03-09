import { Router } from "express";
import { appConfig } from "../config/app.js";
import { sendSuccess } from "../utils/response.js";
import { projectRouter } from "../modules/project/project.route.js";

const v1Router = Router();

v1Router.get("/", (_req, res) => {
  return sendSuccess(res, {
    name: appConfig.appName,
    version: appConfig.apiVersion,
    basePath: appConfig.apiPrefix,
    status: "ok",
  });
});

v1Router.use("/projects", projectRouter);

export default v1Router;
