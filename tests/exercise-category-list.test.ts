import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";

const url = "/api/exercises/category/list";

describe(`GET ${url}`, async () => {
  const di = await bootstrap();
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(401);
    expect(json).toEqual({ message: bg.ShieldAuthStrategyError.Rejected });
  });

  test("happy path", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Exercises.ListExerciseCategoriesQuery, "execute").mockResolvedValue({
        data: [mocks.exerciseCategory],
        actions: {
          add: { available: false, enabled: false, hints: [] },
          rename: { available: false, enabled: false, hints: [] },
          delete: { available: false, enabled: false, hints: [] },
        },
      }),
    );

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      data: [mocks.exerciseCategory],
      actions: {
        add: { available: false, enabled: false, hints: [] },
        rename: { available: false, enabled: false, hints: [] },
        delete: { available: false, enabled: false, hints: [] },
      },
    });
  });

  test("happy path - empty", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Exercises.ListExerciseCategoriesQuery, "execute").mockResolvedValue({
        data: [],
        actions: {
          add: { available: true, enabled: true, hints: [] },
          rename: { available: true, enabled: true, hints: [] },
          delete: { available: true, enabled: true, hints: [] },
        },
      }),
    );

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      data: [],
      actions: {
        add: { available: true, enabled: true, hints: [] },
        rename: { available: true, enabled: true, hints: [] },
        delete: { available: true, enabled: true, hints: [] },
      },
    });
  });
});
