import { env } from "./env.js";

export const appConfig = {
  appName: "Delivery PM Tool API",
  apiVersion: "v1",
  apiPrefix: "/api/v1",
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
} as const;
