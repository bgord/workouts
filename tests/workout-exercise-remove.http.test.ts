import { describe, expect, spyOn, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/workouts/${mocks.workoutId}/exercise/${mocks.workoutExerciseId}`;

const draft = mocks.workoutWithExerciseHistory;

describe("DELETE /api/workouts/:workoutId/exercise/:workoutExerciseId", async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "DELETE" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - incorrect workout id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      `/api/workouts/id/exercise/${mocks.workoutExerciseId}`,
      { method: "DELETE" },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("validation - incorrect workout exercise id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      `/api/workouts/${mocks.workoutId}/exercise/id`,
      { method: "DELETE" },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("WorkoutExists", async () => {
    const events = [] as const;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      { method: "DELETE", headers: mocks.revisionHeaders(events.length) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 404, "workout.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WorkoutIsEditable - completed", async () => {
    const events = mocks.workoutCompletedHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      { method: "DELETE", headers: mocks.revisionHeaders(events.length) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "workout.is.editable");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WorkoutBelongsToUser", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(draft);

    const response = await server.request(
      url,
      { method: "DELETE", headers: mocks.revisionHeaders(draft.length) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "workout.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WorkoutExerciseExists", async () => {
    const events = [mocks.GenericWorkoutCreatedEvent];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      { method: "DELETE", headers: mocks.revisionHeaders(events.length) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "workout.exercise.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("revision mismatch", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(draft);

    const response = await server.request(
      url,
      { method: "DELETE", headers: mocks.revisionHeaders(99) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 412, "revision.mismatch");
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(draft);

    const response = await server.request(
      url,
      {
        method: "DELETE",
        headers: { ...mocks.revisionHeaders(draft.length), ...mocks.correlationIdHeaders },
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWorkoutExerciseRemovedEvent]);
  });

  test("happy path - in progress", async () => {
    const events = mocks.workoutInProgressHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "DELETE",
        headers: { ...mocks.revisionHeaders(events.length), ...mocks.correlationIdHeaders },
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWorkoutExerciseRemovedEvent]);
  });

  test("happy path - in progress with logged sets", async () => {
    const events = mocks.workoutWithLoggedSetHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "DELETE",
        headers: { ...mocks.revisionHeaders(events.length), ...mocks.correlationIdHeaders },
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWorkoutExerciseRemovedEvent]);
  });
});
