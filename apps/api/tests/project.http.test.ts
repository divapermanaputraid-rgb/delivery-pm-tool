import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";

import app from "../src/app.js";
import { db } from "../src/lib/db.js";

const createdProjectIds: string[] = [];
const createdTaskIds: string[] = [];

describe("Project HTTP routes", () => {
  it("GET /api/v1/projects should return project list", async () => {
    const response = await request(app).get("/api/v1/projects");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.projects)).toBe(true);
    expect(typeof response.body.meta.requestId).toBe("string");
    expect(typeof response.headers["x-request-id"]).toBe("string");
  });

  it("POST /api/v1/projects should create project", async () => {
    const name = `Project Test ${Date.now()}`;

    const response = await request(app).post("/api/v1/projects").send({ name });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.project.name).toBe(name);
    expect(typeof response.body.data.project.id).toBe("string");
    expect(typeof response.body.meta.requestId).toBe("string");
    expect(typeof response.headers["x-request-id"]).toBe("string");

    createdProjectIds.push(response.body.data.project.id);
  });

  it("POST /api/v1/projects should reject invalid payload", async () => {
    const response = await request(app)
      .post("/api/v1/projects")
      .send({ name: " " });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.meta.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "name",
          message: "Project name is required",
        }),
      ]),
    );
    expect(typeof response.body.meta.requestId).toBe("string");
    expect(typeof response.headers["x-request-id"]).toBe("string");
  });

  it("GET /api/v1/projects/:projectId should return project detail", async () => {
    const name = `Project Detail Test ${Date.now()}`;

    const createdResponse = await request(app)
      .post("/api/v1/projects")
      .send({ name });

    expect(createdResponse.status).toBe(201);

    const projectId = createdResponse.body.data.project.id;
    createdProjectIds.push(projectId);

    const response = await request(app).get(`/api/v1/projects/${projectId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.project.id).toBe(projectId);
    expect(response.body.data.project.name).toBe(name);
    expect(typeof response.body.meta.requestId).toBe("string");
    expect(typeof response.headers["x-request-id"]).toBe("string");
  });

  it("GET /api/v1/projects/:projectId should return 404 when project does not exist", async () => {
    const response = await request(app).get("/api/v1/projects/not-found-id");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("PROJECT_NOT_FOUND");
    expect(response.body.error.message).toBe(
      "Project with id not-found-id not found",
    );
    expect(typeof response.body.meta.requestId).toBe("string");
    expect(typeof response.headers["x-request-id"]).toBe("string");
  });

  it("PATCH /api/v1/projects/:projectId should update project name", async () => {
    const initialName = `Project Update Test ${Date.now()}`;
    const updatedName = `Updated Project ${Date.now()}`;

    const createdResponse = await request(app)
      .post("/api/v1/projects")
      .send({ name: initialName });

    expect(createdResponse.status).toBe(201);

    const projectId = createdResponse.body.data.project.id;
    createdProjectIds.push(projectId);

    const response = await request(app)
      .patch(`/api/v1/projects/${projectId}`)
      .send({ name: updatedName });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.project.id).toBe(projectId);
    expect(response.body.data.project.name).toBe(updatedName);
    expect(typeof response.body.meta.requestId).toBe("string");
    expect(typeof response.headers["x-request-id"]).toBe("string");
  });

  it("PATCH /api/v1/projects/:projectId should return 404 when project does not exist", async () => {
    const response = await request(app)
      .patch("/api/v1/projects/not-found-id")
      .send({ name: "Updated Missing Project" });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("PROJECT_NOT_FOUND");
    expect(response.body.error.message).toBe(
      "Project with id not-found-id not found",
    );
    expect(typeof response.body.meta.requestId).toBe("string");
    expect(typeof response.headers["x-request-id"]).toBe("string");
  });

  it("PATCH /api/v1/projects/:projectId should reject invalid payload", async () => {
    const initialName = `Project Invalid Update Test ${Date.now()}`;

    const createdResponse = await request(app)
      .post("/api/v1/projects")
      .send({ name: initialName });

    expect(createdResponse.status).toBe(201);

    const projectId = createdResponse.body.data.project.id;
    createdProjectIds.push(projectId);

    const response = await request(app)
      .patch(`/api/v1/projects/${projectId}`)
      .send({ name: " " });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.meta.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "name",
          message: "Project name is required",
        }),
      ]),
    );
    expect(typeof response.body.meta.requestId).toBe("string");
    expect(typeof response.headers["x-request-id"]).toBe("string");
  });
});

it("DELETE /api/v1/projects/:projectId should delete project", async () => {
  const name = `Project Delete Test ${Date.now()}`;

  const createdResponse = await request(app)
    .post("/api/v1/projects")
    .send({ name });

  expect(createdResponse.status).toBe(201);

  const projectId = createdResponse.body.data.project.id;

  const deleteResponse = await request(app).delete(
    `/api/v1/projects/${projectId}`,
  );
  expect(deleteResponse.status).toBe(200);
  expect(deleteResponse.body.success).toBe(true);
  expect(deleteResponse.body.data.project.id).toBe(projectId);
  expect(deleteResponse.body.data.project.name).toBe(name);
  expect(typeof deleteResponse.body.meta.requestId).toBe("string");
  expect(typeof deleteResponse.headers["x-request-id"]).toBe("string");

  const detailResponse = await request(app).get(
    `/api/v1/projects/${projectId}`,
  );

  expect(detailResponse.status).toBe(404);
  expect(detailResponse.body.success).toBe(false);
  expect(detailResponse.body.error.code).toBe("PROJECT_NOT_FOUND");
});

it("DELETE /api/v1/projects/:projectId should return 404 when project does not exist", async () => {
  const response = await request(app).delete("/api/v1/projects/not-found-id");

  expect(response.status).toBe(404);
  expect(response.body.success).toBe(false);
  expect(response.body.error.code).toBe("PROJECT_NOT_FOUND");
  expect(response.body.error.message).toBe(
    "Project with id not-found-id not found",
  );
  expect(typeof response.body.meta.requestId).toBe("string");
  expect(typeof response.headers["x-request-id"]).toBe("string");
});

it("GET /api/v1/projects should support limit query", async () => {
  for (let index = 0; index < 3; index += 1) {
    const createdResponse = await request(app)
      .post("/api/v1/projects")
      .send({ name: `Project Limit Test ${Date.now()}-${index}` });

    expect(createdResponse.status).toBe(201);
    createdProjectIds.push(createdResponse.body.data.project.id);
  }
  const response = await request(app).get("/api/v1/projects?limit=2");

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(Array.isArray(response.body.data.projects)).toBe(true);
  expect(response.body.data.projects.length).toBeLessThanOrEqual(2);
  expect(typeof response.body.meta.requestId).toBe("string");
  expect(typeof response.headers["x-request-id"]).toBe("string");
});

it("GET /api/v1/projects should reject invalid limit query", async () => {
  const response = await request(app).get("/api/v1/projects?limit=0");

  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
  expect(response.body.error.code).toBe("VALIDATION_ERROR");
  expect(response.body.meta.details).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        field: "limit",
        message: "Limit must be a positive integer",
      }),
    ]),
  );
  expect(typeof response.body.meta.requestId).toBe("string");
  expect(typeof response.headers["x-request-id"]).toBe("string");
});

it("POST /api/v1/projects/:projectId/tasks should create task", async () => {
  const projectResponse = await request(app)
    .post("/api/v1/projects")
    .send({ name: `Project Task Create Test ${Date.now()}` });

  expect(projectResponse.status).toBe(201);

  const projectId = projectResponse.body.data.project.id;
  createdProjectIds.push(projectId);

  const response = await request(app)
    .post(`/api/v1/projects/${projectId}/tasks`)
    .send({
      code: `TASK-${Date.now()}`,
      title: "First task",
    });

  expect(response.status).toBe(201);
  expect(response.body.success).toBe(true);
  expect(typeof response.body.data.task.id).toBe("string");
  expect(response.body.data.task.projectId).toBe(projectId);
  expect(response.body.data.task.title).toBe("First task");
  expect(typeof response.body.meta.requestId).toBe("string");
  expect(typeof response.headers["x-request-id"]).toBe("string");

  createdTaskIds.push(response.body.data.task.id);
});

it("POST /api/v1/projects/:projectId/tasks should reject invalid payload", async () => {
  const projectResponse = await request(app)
    .post("/api/v1/projects")
    .send({ name: `Project Task Invalid Payload test ${Date.now()}` });

  expect(projectResponse.status).toBe(201);

  const projectId = projectResponse.body.data.project.id;
  createdProjectIds.push(projectId);

  const response = await request(app)
    .post(`/api/v1/projects/${projectId}/tasks`)
    .send({
      code: " ",
      title: " ",
    });

  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
  expect(response.body.error.code).toBe("VALIDATION_ERROR");
  expect(response.body.meta.details).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        field: "code",
        message: "Task code is required",
      }),
      expect.objectContaining({
        field: "title",
        message: "Task title is required",
      }),
    ]),
  );
  expect(typeof response.body.meta.requestId).toBe("string");
  expect(typeof response.headers["x-request-id"]).toBe("string");
});

it("POST /api/v1/projects/:projectId/tasks should return 404 when project does not exist", async () => {
  const response = await request(app)
    .post("/api/v1/projects/not-found-id/tasks")
    .send({
      code: `TASK-${Date.now()}`,
      title: "Missing project task",
    });

  expect(response.status).toBe(404);
  expect(response.body.success).toBe(false);
  expect(response.body.error.code).toBe("PROJECT_NOT_FOUND");
  expect(response.body.error.message).toBe(
    "Project with id not-found-id not found",
  );
  expect(typeof response.body.meta.requestId).toBe("string");
  expect(typeof response.headers["x-request-id"]).toBe("string");
});

it("GET /api/v1/projects/:projectId/tasks should return task list", async () => {
  const projectResponse = await request(app)
    .post("/api/v1/projects")
    .send({ name: `Project Task List Test ${Date.now()}` });

  expect(projectResponse.status).toBe(201);

  const projectId = projectResponse.body.data.project.id;
  createdProjectIds.push(projectId);

  const firstTaskResponse = await request(app)
    .post(`/api/v1/projects/${projectId}/tasks`)
    .send({
      code: `TASK-${Date.now()}-1`,
      title: "Task One",
    });

  expect(firstTaskResponse.status).toBe(201);
  createdTaskIds.push(firstTaskResponse.body.data.task.id);

  const secondTaskResponse = await request(app)
    .post(`/api/v1/projects/${projectId}/tasks`)
    .send({
      code: `TASK-${Date.now()}-2`,
      title: "Task Two",
    });

  expect(secondTaskResponse.status).toBe(201);
  createdTaskIds.push(secondTaskResponse.body.data.task.id);

  const response = await request(app).get(
    `/api/v1/projects/${projectId}/tasks`,
  );

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(Array.isArray(response.body.data.tasks)).toBe(true);
  expect(response.body.data.tasks.length).toBeGreaterThanOrEqual(2);
  expect(typeof response.body.meta.requestId).toBe("string");
  expect(typeof response.headers["x-request-id"]).toBe("string");
});

it("GET /api/v1/projects/:projectId/tasks should return 404 when project does not exist", async () => {
  const response = await request(app).get(
    "/api/v1/projects/not-found-id/tasks",
  );

  expect(response.status).toBe(404);
  expect(response.body.success).toBe(false);
  expect(response.body.error.code).toBe("PROJECT_NOT_FOUND");
  expect(response.body.error.message).toBe(
    "Project with id not-found-id not found",
  );
  expect(typeof response.body.meta.requestId).toBe("string");
  expect(typeof response.headers["x-request-id"]).toBe("string");
});

it("POST /api/v1/projects/:projectId/tasks should return 409 when task code already exists in the same project", async () => {
  const projectResponse = await request(app)
    .post("/api/v1/projects")
    .send({ name: `Project Task Duplicate Code Test ${Date.now()}` });

  expect(projectResponse.status).toBe(201);

  const projectId = projectResponse.body.data.project.id;
  createdProjectIds.push(projectId);

  const taskCode = `TASK-DUPLICATE-${Date.now()}`;

  const firstResponse = await request(app)
    .post(`/api/v1/projects/${projectId}/tasks`)
    .send({
      code: taskCode,
      title: "First duplicate candidate",
    });

  expect(firstResponse.status).toBe(201);
  createdTaskIds.push(firstResponse.body.data.task.id);

  const secondResponse = await request(app)
    .post(`/api/v1/projects/${projectId}/tasks`)
    .send({
      code: taskCode,
      title: "Second duplicate candidate",
    });

  expect(secondResponse.status).toBe(409);
  expect(secondResponse.body.success).toBe(false);
  expect(secondResponse.body.error.code).toBe("TASK_CODE_ALREADY_EXISTS");
  expect(secondResponse.body.error.message).toBe(
    `Task code ${taskCode} already exists in this project`,
  );
  expect(typeof secondResponse.body.meta.requestId).toBe("string");
  expect(typeof secondResponse.headers["x-request-id"]).toBe("string");
});

it("GET /api/v1/projects/:projectId/tasks/:taskId should return task detail", async () => {
  const projectResponse = await request(app)
    .post("/api/v1/projects")
    .send({ name: `Project Task Detail Test ${Date.now()}` });

  expect(projectResponse.status).toBe(201);

  const projectId = projectResponse.body.data.project.id;
  createdProjectIds.push(projectId);

  const taskResponse = await request(app)
    .post(`/api/v1/projects/${projectId}/tasks`)
    .send({
      code: `TASK-DETAIL-${Date.now()}`,
      title: "Task Detail Target",
    });

  expect(taskResponse.status).toBe(201);

  const taskId = taskResponse.body.data.task.id;
  createdTaskIds.push(taskId);

  const response = await request(app).get(
    `/api/v1/projects/${projectId}/tasks/${taskId}`,
  );

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.data.task.id).toBe(taskId);
  expect(response.body.data.task.projectId).toBe(projectId);
  expect(response.body.data.task.title).toBe("Task Detail Target");
  expect(typeof response.body.meta.requestId).toBe("string");
  expect(typeof response.headers["x-request-id"]).toBe("string");
});

it("GET /api/v1/projects/:projectId/tasks/:taskId should return 404 when project does not exist", async () => {
  const response = await request(app).get(
    "/api/v1/projects/not-found-id/tasks/not-found-task-id",
  );

  expect(response.status).toBe(404);
  expect(response.body.success).toBe(false);
  expect(response.body.error.code).toBe("PROJECT_NOT_FOUND");
  expect(response.body.error.message).toBe(
    "Project with id not-found-id not found",
  );
  expect(typeof response.body.meta.requestId).toBe("string");
  expect(typeof response.headers["x-request-id"]).toBe("string");
});

it("GET /api/v1/projects/:projectId/tasks/:taskId should return 404 when task does not exist in the project", async () => {
  const projectResponse = await request(app)
    .post("/api/v1/projects")
    .send({ name: `Project Missing Task Detail Test ${Date.now()}` });

  expect(projectResponse.status).toBe(201);

  const projectId = projectResponse.body.data.project.id;
  createdProjectIds.push(projectId);

  const response = await request(app).get(
    `/api/v1/projects/${projectId}/tasks/not-found-task-id`,
  );

  expect(response.status).toBe(404);
  expect(response.body.success).toBe(false);
  expect(response.body.error.code).toBe("TASK_NOT_FOUND");
  expect(response.body.error.message).toBe(
    `Task with id not-found-task-id not found in project ${projectId}`,
  );
  expect(typeof response.body.meta.requestId).toBe("string");
  expect(typeof response.headers["x-request-id"]).toBe("string");
});

afterAll(async () => {
  if (createdTaskIds.length > 0) {
    await db.task.deleteMany({
      where: {
        id: {
          in: createdTaskIds,
        },
      },
    });
  }
  if (createdProjectIds.length > 0) {
    await db.project.deleteMany({
      where: {
        id: {
          in: createdProjectIds,
        },
      },
    });
  }
  await db.$disconnect();
});
