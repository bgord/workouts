import { describe, expect, spyOn, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/exercises/category/${mocks.exerciseCategoryId}`;

describe("DELETE /api/exercises/category/:exerciseCategoryId", async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "DELETE" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - incorrect exercise category id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);

    const response = await server.request("/api/exercises/category/id", { method: "DELETE" }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("ExerciseCategoryExists", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth));
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseCategoryQuery, "execute")).mockResolvedValue(null);

    const response = await server.request(url, { method: "DELETE" }, mocks.ip);

    await testcases.assertErrorResponse(response, 403, "exercise.category.exists");
  });

  test("CatalogIsManagedByAdmin", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Exercises.GetExerciseCategoryQuery, "execute"))
      .mockResolvedValue(mocks.exerciseCategory);

    const response = await server.request(url, { method: "DELETE" }, mocks.ip);

    await testcases.assertErrorResponse(response, 403, "catalog.is.managed.by.admin");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth));
    spies
      .use(spyOn(di.Adapters.Exercises.GetExerciseCategoryQuery, "execute"))
      .mockResolvedValue(mocks.exerciseCategory);

    const response = await server.request(
      url,
      { method: "DELETE", headers: mocks.correlationIdHeaders },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericExerciseCategoryDeletedEvent]);
  });
});
