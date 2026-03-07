import { Router } from "express";

const rootRouter = Router();

rootRouter.get("/", (_req, res) =>{
    res.status(200).json({
        name: "Delivery PM Tool API",
        version: "v1",
        status: "running",
    });
});

export default rootRouter;

