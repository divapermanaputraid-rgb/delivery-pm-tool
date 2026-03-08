import { Router } from "express";
import { sendSuccess } from "../utils/response.js";

const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  return sendSuccess(res, {
    ok: true,
  });
});

export default healthRouter;
