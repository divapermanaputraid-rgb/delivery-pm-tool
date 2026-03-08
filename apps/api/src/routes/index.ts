import { Router } from "express";
import healthRouter from "./route.js";
import rootRouter from "./root.route.js";
import v1Router from "./v1.route.js";
import { appConfig } from "../config/app.js";

const router = Router();

router.use("/", rootRouter);
router.use("/", healthRouter);
router.use(appConfig.apiPrefix, v1Router);

export default router;
