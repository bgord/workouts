import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/exercises/category/${mocks.exerciseCategoryId}`;

describe(`PATCH ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "PATCH" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.ShieldAuthStrategyError.Rejected, _known: true });
  });

  test("validation - incorrect exercise category id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request("/api/exercises/category/id", { method: "PATCH" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type", _known: true });
  });

  test("validation - empty payload", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(url, { method: "PATCH" }, mocks.ip);

    expect(response.status).toEqual(500);
  });

  test("validation - name - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "PATCH", body: JSON.stringify({}) }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "exercise.category.name.type", _known: true });
  });

  test("validation - name - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ name: "a".repeat(129) }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "exercise.category.name.invalid", _known: true });
  });

  test("ExerciseCategoryExists", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseCategoryQuery, "execute")).mockResolvedValue(null);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ name: mocks.anotherExerciseCategoryName }) },
      mocks.ip,
    );
    await testcases.assertInvariantError(response, 403, "exercise.category.exists");
  });

  test("ExerciseCategoryNameIsUnique", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Exercises.GetExerciseCategoryQuery, "execute"))
      .mockResolvedValue(mocks.exerciseCategory);
    spies
      .use(spyOn(di.Adapters.Exercises.GetExerciseCategoryNameCount, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(1));

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ name: mocks.anotherExerciseCategoryName }) },
      mocks.ip,
    );
    await testcases.assertInvariantError(response, 403, "exercise.category.name.is.unique");
  });

  test("happy path", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Exercises.GetExerciseCategoryQuery, "execute"))
      .mockResolvedValue(mocks.exerciseCategory);
    spies
      .use(spyOn(di.Adapters.Exercises.GetExerciseCategoryNameCount, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({ name: mocks.anotherExerciseCategoryName }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericExerciseCategoryRenamedEvent]);
  });
});
