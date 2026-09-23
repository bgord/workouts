import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const loggedSetId = mocks.correctedLoggedSet.id;
const url = `/api/workouts/${mocks.workoutId}/exercise/${mocks.workoutExerciseId}/set/${loggedSetId}`;

const body = JSON.stringify({
  reps: mocks.correctedLoggedSet.reps,
  load: mocks.correctedLoggedSet.load,
});

const logged = mocks.workoutWithLoggedSetHistory;

describe("PATCH /api/workouts/:workoutId/exercise/:workoutExerciseId/set/:loggedSetId", async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "PATCH", body }, mocks.ip);
    await testcases.assertErrorResponse(response, 401, bg.ShieldAuthStrategyError.Rejected);
  });

  test("validation - incorrect workout id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      `/api/workouts/id/exercise/${mocks.workoutExerciseId}/set/${loggedSetId}`,
      { method: "PATCH", body },
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
      { method: "PATCH", body, headers: mocks.revisionHeaders(events.length) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 404, "workout.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WorkoutIsCorrectable - draft", async () => {
    const events = mocks.workoutWithExerciseHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      { method: "PATCH", body, headers: mocks.revisionHeaders(events.length) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "workout.is.correctable");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WorkoutBelongsToUser", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(logged);

    const response = await server.request(
      url,
      { method: "PATCH", body, headers: mocks.revisionHeaders(logged.length) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "workout.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WorkoutLoggedSetExists", async () => {
    const events = mocks.workoutInProgressHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      { method: "PATCH", body, headers: mocks.revisionHeaders(events.length) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 404, "workout.logged.set.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("revision mismatch", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(logged);

    const response = await server.request(
      url,
      { method: "PATCH", body, headers: mocks.revisionHeaders(99) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 412, "revision.mismatch");
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(logged);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body,
        headers: { ...mocks.revisionHeaders(logged.length), ...mocks.correlationIdHeaders },
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWorkoutSetCorrectedEvent]);
  });

  test("happy path - completed workout", async () => {
    const events = mocks.workoutCompletedHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body,
        headers: { ...mocks.revisionHeaders(events.length), ...mocks.correlationIdHeaders },
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWorkoutSetCorrectedEvent]);
  });

  test("happy path - with rir", async () => {
    const events = mocks.workoutWithLoggedSetHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: { ...mocks.revisionHeaders(events.length), ...mocks.correlationIdHeaders },
        body: JSON.stringify(mocks.correctedLoggedSetWithRir),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWorkoutSetCorrectedEventWithRir]);
  });
});
