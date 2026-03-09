import { db } from "../lib/db.js";
import {
  createProject,
  listProjects,
} from "../modules/project/project.service.js";

async function main() {
  const createdProject = await createProject({
    name: `Test project ${Date.now()}`,
  });

  console.log("Created project:", createdProject);

  const projects = await listProjects();

  console.log("Recent projects:", projects.slice(0, 5));

  await db.$disconnect();
}

main().catch(async (error) => {
  console.error("Project flow test failed", error);
  await db.$disconnect().catch(() => undefined);
  process.exit(1);
});
