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

describe("PATCH /api/exercises/category/:exerciseCategoryId", async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "PATCH" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(401);
    expect(json).toEqual({ message: bg.ShieldAuthStrategyError.Rejected });
  });

  test("validation - incorrect exercise category id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);

    const response = await server.request("/api/exercises/category/id", { method: "PATCH" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type" });
  });

  test("validation - name - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);

    const response = await server.request(url, { method: "PATCH", body: JSON.stringify({}) }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "exercise.category.name.type" });
  });

  test("validation - name - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ name: "a".repeat(129) }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "exercise.category.name.invalid" });
  });

  test("ExerciseCategoryExists", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth));
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseCategoryQuery, "execute")).mockResolvedValue(null);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ name: mocks.anotherExerciseCategoryName }) },
      mocks.ip,
    );
    await testcases.assertInvariantError(response, 403, "exercise.category.exists");
  });

  test("CatalogIsManagedByAdmin", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Exercises.GetExerciseCategoryQuery, "execute"))
      .mockResolvedValue(mocks.exerciseCategory);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ name: mocks.anotherExerciseCategoryName }) },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "catalog.is.managed.by.admin");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("ExerciseCategoryNameIsUnique", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth));
    spies
      .use(spyOn(di.Adapters.Exercises.GetExerciseCategoryQuery, "execute"))
      .mockResolvedValue(mocks.exerciseCategory);
    spies
      .use(spyOn(di.Adapters.Exercises.GetExerciseCategoryNameCountQuery, "execute"))
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
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth));
    spies
      .use(spyOn(di.Adapters.Exercises.GetExerciseCategoryQuery, "execute"))
      .mockResolvedValue(mocks.exerciseCategory);
    spies
      .use(spyOn(di.Adapters.Exercises.GetExerciseCategoryNameCountQuery, "execute"))
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
