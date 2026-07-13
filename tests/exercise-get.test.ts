import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";

const url = `/api/exercises/${mocks.exerciseId}`;

describe(`GET ${url}`, async () => {
  const di = await bootstrap();
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.ShieldAuthStrategyError.Rejected, _known: true });
  });

  test("validation - incorrect exercise id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request("/api/exercises/id", { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type", _known: true });
  });

  test("not found", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute").mockResolvedValue(null));

    const response = await server.request(url, { method: "GET" }, mocks.ip);

    expect(response.status).toEqual(404);
  });

  test("happy path - no categories", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute").mockResolvedValue(mocks.exercise));
    spies.use(
      spyOn(di.Adapters.Exercises.ListCategoriesAssignedToExerciseQuery, "execute").mockResolvedValue([]),
    );

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({ ...mocks.exercise, categories: [] });
  });

  test("happy path", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute").mockResolvedValue(mocks.exercise));
    spies.use(
      spyOn(di.Adapters.Exercises.ListCategoriesAssignedToExerciseQuery, "execute").mockResolvedValue([
        mocks.exerciseCategory,
      ]),
    );

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({ ...mocks.exercise, categories: [mocks.exerciseCategory] });
  });
});
