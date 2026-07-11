import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";

const url = "/api/exercises/search";

describe(`GET ${url}`, async () => {
  const di = await bootstrap();
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.ShieldAuthStrategyError.Rejected, _known: true });
  });

  test("validation - empty query", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "exercise.name.type", _known: true });
  });

  test("validation - query - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url + `?search=${"a".repeat(129)}`, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "exercise.name.invalid", _known: true });
  });

  test("happy path", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Exercises.SearchExercisesQuery, "execute").mockResolvedValue([mocks.exercise]),
    );

    const response = await server.request(url + `?search=${mocks.exerciseName}`, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual([mocks.exercise]);
  });

  test("happy path - empty", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Exercises.SearchExercisesQuery, "execute").mockResolvedValue([]));

    const response = await server.request(url + `?search=${mocks.exerciseName}`, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual([]);
  });
});
