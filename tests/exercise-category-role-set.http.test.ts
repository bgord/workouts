import { describe, expect, spyOn, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/exercises/category/role-set";

const payload = {
  exerciseId: mocks.exerciseId,
  exerciseCategoryId: mocks.exerciseCategoryId,
  role: mocks.anotherExerciseCategoryRole,
};

describe(`POST ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - exerciseId - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);

    const response = await server.request(url, { method: "POST", body: JSON.stringify({}) }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("validation - exerciseId - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ exerciseId: "a" }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("validation - exerciseCategoryId - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ exerciseId: mocks.exerciseId }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("validation - exerciseCategoryId - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ exerciseId: mocks.exerciseId, exerciseCategoryId: "a" }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("validation - role - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ exerciseId: mocks.exerciseId, exerciseCategoryId: mocks.exerciseCategoryId }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "exercise.category.role.invalid");
  });

  test("validation - role - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          exerciseId: mocks.exerciseId,
          exerciseCategoryId: mocks.exerciseCategoryId,
          role: "invalid",
        }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "exercise.category.role.invalid");
  });

  test("CatalogIsManagedByAdmin", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);

    const response = await server.request(url, { method: "POST", body: JSON.stringify(payload) }, mocks.ip);

    await testcases.assertErrorResponse(response, 403, "catalog.is.managed.by.admin");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("ExerciseExists", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(null);

    const response = await server.request(url, { method: "POST", body: JSON.stringify(payload) }, mocks.ip);

    await testcases.assertErrorResponse(response, 403, "exercise.exists");
  });

  test("ExerciseIsAssignedToCategory", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);
    spies
      .use(spyOn(di.Adapters.Exercises.ListCategoriesAssignedToExerciseQuery, "execute"))
      .mockResolvedValue([]);

    const response = await server.request(url, { method: "POST", body: JSON.stringify(payload) }, mocks.ip);

    await testcases.assertErrorResponse(response, 403, "exercise.is.assigned.to.category");
  });

  test("ExerciseCategoryRoleHasChanged", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);
    spies
      .use(spyOn(di.Adapters.Exercises.ListCategoriesAssignedToExerciseQuery, "execute"))
      .mockResolvedValue([{ ...mocks.exerciseCategoryAssignment, role: mocks.anotherExerciseCategoryRole }]);

    const response = await server.request(url, { method: "POST", body: JSON.stringify(payload) }, mocks.ip);

    await testcases.assertErrorResponse(response, 403, "exercise.category.role.has.changed");
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.adminAuth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);
    spies
      .use(spyOn(di.Adapters.Exercises.ListCategoriesAssignedToExerciseQuery, "execute"))
      .mockResolvedValue([mocks.anotherExerciseCategoryAssignment, mocks.exerciseCategoryAssignment]);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.correlationIdHeaders, body: JSON.stringify(payload) },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericExerciseCategoryRoleSetEvent]);
  });
});
