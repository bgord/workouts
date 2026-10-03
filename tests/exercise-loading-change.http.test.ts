import { describe, expect, spyOn, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/exercises/${mocks.exerciseId}/loading`;

describe("PATCH /api/exercises/:exerciseId/loading", async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "PATCH" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - incorrect exercise id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);

    const response = await server.request(
      "/api/exercises/id/loading",
      { method: "PATCH", body: JSON.stringify({}) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("validation - loading - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);

    const response = await server.request(url, { method: "PATCH", body: JSON.stringify({}) }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "exercise.loading.invalid");
  });

  test("validation - loading - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ loading: "invalid" }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "exercise.loading.invalid");
  });

  test("CatalogIsManagedByAdmin", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ loading: mocks.anotherExerciseLoading }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "catalog.is.managed.by.admin");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("ExerciseExists", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(null);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ loading: mocks.anotherExerciseLoading }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "exercise.exists");
  });

  test("ExerciseLoadingHasChanged", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ loading: mocks.exerciseLoading }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "exercise.loading.has.changed");
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({ loading: mocks.anotherExerciseLoading }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericExerciseLoadingChangedEvent]);
  });
});
