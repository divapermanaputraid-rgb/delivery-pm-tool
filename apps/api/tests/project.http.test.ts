import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import app from "../src/app.js";
import { db } from "../src/lib/db.js";
import { response } from "express";

const createdProjectIds: string[] = [];

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
    const name = `Project Detail test ${Date.now()}`;

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
});
afterAll(async () => {
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
