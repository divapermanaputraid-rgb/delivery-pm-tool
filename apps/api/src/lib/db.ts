import { createDb } from "@delivery-pm-tool/db";
import { env } from "../config/env.js";

export const db = createDb(env.DATABASE_URL);
