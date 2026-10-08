import { describe, expect, spyOn, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/exercises/${mocks.exerciseId}/load-step`;

describe("PATCH /api/exercises/:exerciseId/load-step", async () => {
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
      "/api/exercises/id/load-step",
      { method: "PATCH", body: JSON.stringify({}) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("validation - load step - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);

    const response = await server.request(url, { method: "PATCH", body: JSON.stringify({}) }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "exercise.load.step.invalid");
  });

  test("validation - load step - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ loadStep: "invalid" }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "exercise.load.step.invalid");
  });

  test("CatalogIsManagedByAdmin", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ loadStep: mocks.anotherExerciseLoadStep }) },
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
      { method: "PATCH", body: JSON.stringify({ loadStep: mocks.anotherExerciseLoadStep }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "exercise.exists");
  });

  test("ExerciseLoadStepHasChanged", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ loadStep: mocks.exerciseLoadStep }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "exercise.load.step.has.changed");
  });

  test("ExerciseLoadStepIsApplicable", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute"))
      .mockResolvedValue(mocks.bodyweightExercise);

    const response = await server.request(
      url,
      { method: "PATCH", body: JSON.stringify({ loadStep: mocks.anotherExerciseLoadStep }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "exercise.load.step.is.applicable");
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
        body: JSON.stringify({ loadStep: mocks.anotherExerciseLoadStep }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericExerciseLoadStepSetEvent]);
  });
});
