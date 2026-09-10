import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";

const url = `/api/exercises/${mocks.exerciseId}`;

describe("GET /api/exercises/:exerciseId", async () => {
  const di = await bootstrap();
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(401);
    expect(json).toEqual({ message: bg.ShieldAuthStrategyError.Rejected });
  });

  test("validation - incorrect exercise id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request("/api/exercises/id", { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type" });
  });

  test("not found", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseWithCategoriesQuery, "execute").mockResolvedValue(null));

    const response = await server.request(url, { method: "GET" }, mocks.ip);

    expect(response.status).toEqual(404);
  });

  test("happy path", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Exercises.GetExerciseWithCategoriesQuery, "execute").mockResolvedValue({
        data: { ...mocks.exercise, categories: [] },
        actions: {
          update: { available: false, enabled: false, hints: [] },
          imageChange: { available: false, enabled: false, hints: [] },
          delete: { available: false, enabled: false, hints: [] },
          categoryAssign: { available: false, enabled: false, hints: [] },
          categoryUnassign: { available: false, enabled: false, hints: [] },
        },
      }),
    );

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      data: { ...mocks.exercise, categories: [] },
      actions: {
        update: { available: false, enabled: false, hints: [] },
        imageChange: { available: false, enabled: false, hints: [] },
        delete: { available: false, enabled: false, hints: [] },
        categoryAssign: { available: false, enabled: false, hints: [] },
        categoryUnassign: { available: false, enabled: false, hints: [] },
      },
    });
  });

  test("happy path - admin", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth));
    spies.use(
      spyOn(di.Adapters.Exercises.GetExerciseWithCategoriesQuery, "execute").mockResolvedValue({
        data: { ...mocks.exercise, categories: [mocks.exerciseCategory] },
        actions: {
          update: { available: true, enabled: true, hints: [] },
          imageChange: { available: true, enabled: true, hints: [] },
          delete: { available: true, enabled: false, hints: ["exercise.delete.blocked.in_use"] },
          categoryAssign: { available: true, enabled: true, hints: [] },
          categoryUnassign: { available: true, enabled: true, hints: [] },
        },
      }),
    );

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      data: { ...mocks.exercise, categories: [mocks.exerciseCategory] },
      actions: {
        update: { available: true, enabled: true, hints: [] },
        imageChange: { available: true, enabled: true, hints: [] },
        delete: { available: true, enabled: false, hints: ["exercise.delete.blocked.in_use"] },
        categoryAssign: { available: true, enabled: true, hints: [] },
        categoryUnassign: { available: true, enabled: true, hints: [] },
      },
    });
  });
});
