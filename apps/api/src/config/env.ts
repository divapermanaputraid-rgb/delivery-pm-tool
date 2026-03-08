import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]),
    PORT: z.coerce.number().int().positive(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("Invalid environment variables");
    console.error(parsedEnv.error.flatten().fieldErrors);
    process.exit(1);
}

export const env = parsedEnv.data;