import { Router } from "express";
import healthRouter from "./route.js";
import rootRouter from "./root.route.js";



const router =Router();

router.use(rootRouter);
router.use(healthRouter);

export default router;