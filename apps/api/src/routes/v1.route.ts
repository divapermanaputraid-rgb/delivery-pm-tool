import { Router } from "express";
import { AppError } from "../errors/app-error.js";
import { appConfig } from "../config/app.js";
import { sendSuccess } from "../utils/response.js";

const v1Router = Router();

v1Router.get("/", (_req, res) => {
  return sendSuccess(res, {
    name: appConfig.appName,
    version: appConfig.apiVersion,
    basePath: appConfig.apiPrefix,
    status: "ok",
  });
});

v1Router.get("/error-demo", (_req, _res) => {
  throw new AppError({
    code: "DEMO_BAD_REQUEST",
    message: "Demo controlled error",
    statusCode: 400,
  });
});

export default v1Router;
