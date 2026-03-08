import { db } from "../lib/db.js";
import {
  createProject,
  listRecentProjects,
} from "../modules/project/project.service.js";

async function main() {
  const createdProject = await createProject({
    name: `Test project ${Date.now()}`,
  });

  console.log("Created project:", createdProject);

  const projects = await listRecentProjects(5);

  console.log("Recent projects:", projects);

  await db.$disconnect();
}

main().catch(async (error) => {
  console.error("Project flow test failed", error);
  await db.$disconnect().catch(() => undefined);
  process.exit(1);
});
