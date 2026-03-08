import express from "express";
import { errorHandler } from "./middlewares/error.middleware.js";
import { notFoundHandler } from "./middlewares/not-found.middleware.js";
import { requestIdMiddleware } from "./middlewares/request-id.middleware.js";
import { requestLoggerMiddleware } from "./middlewares/request-logger.middleware.js";
import router from "./routes/index.js";

const app = express();

app.use(requestIdMiddleware);
app.use(requestLoggerMiddleware);
app.use(express.json());
app.use(router);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
