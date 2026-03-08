import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { z } from "zod";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);
const apiRootPath = path.resolve(currentDirPath, "../../");
const envFilePath = path.join(apiRootPath, ".env");

if (!fs.existsSync(envFilePath)) {
  console.error(`Environment file not found at ${envFilePath}`);
  process.exit(1);
}

dotenv.config({ path: envFilePath });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.coerce.number().int().positive(),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables");
  console.error(parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

console.log(`Environment loaded from ${envFilePath}`);

export const env = parsedEnv.data;
