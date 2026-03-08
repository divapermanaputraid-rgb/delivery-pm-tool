import { db } from "../lib/db.js";

async function main() {
  await db.$connect();

  const result = await db.$queryRaw`SELECT 1`;
  console.log("Database connection OK:", result);

  await db.$disconnect();
}

main().catch(async (error) => {
  console.error("Datebase connection failed:", error);
  await db.$disconnect().catch(() => undefined);
  process.exit(1);
});
