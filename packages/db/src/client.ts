import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";

export function createDb(connectionString: string) {
  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({ adapter });
}
