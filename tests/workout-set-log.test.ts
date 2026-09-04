import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/workouts/${mocks.workoutId}/exercise/${mocks.workoutExerciseId}/set`;

describe("POST /api/workouts/:workoutId/exercise/:workoutExerciseId/set", async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(401);
    expect(json).toEqual({ message: bg.ShieldAuthStrategyError.Rejected });
  });

  test("validation - incorrect workout id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      `/api/workouts/id/exercise/${mocks.workoutExerciseId}/set`,
      { method: "POST", body: JSON.stringify({}) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type" });
  });

  test("validation - incorrect workout exercise id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      `/api/workouts/${mocks.workoutId}/exercise/id/set`,
      { method: "POST", body: JSON.stringify({}) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type" });
  });

  test("validation - reps - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(), body: JSON.stringify({}) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "integer.positive.type" });
  });

  test("validation - reps - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(), body: JSON.stringify({ reps: 0 }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "integer.positive.invalid" });
  });

  test("validation - load - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.revisionHeaders(),
        body: JSON.stringify({ reps: mocks.loggedSet.reps }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "weight.grams.type" });
  });

  test("validation - load - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.revisionHeaders(),
        body: JSON.stringify({ reps: mocks.loggedSet.reps, load: -1 }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "weight.grams.invalid" });
  });

  test("WorkoutExists", async () => {
    const events = [] as const;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.revisionHeaders(events.length),
        body: JSON.stringify(mocks.loggedSet),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 404, "workout.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WorkoutIsInProgress", async () => {
    const events = [
      mocks.GenericWorkoutCreatedEvent,
      mocks.GenericWorkoutExerciseAddedEvent,
      mocks.GenericWorkoutExerciseTargetSetEvent,
    ];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.revisionHeaders(events.length),
        body: JSON.stringify(mocks.loggedSet),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "workout.is.in.progress");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WorkoutBelongsToUser", async () => {
    const events = [
      mocks.GenericWorkoutCreatedEvent,
      mocks.GenericWorkoutExerciseAddedEvent,
      mocks.GenericWorkoutExerciseTargetSetEvent,
      mocks.GenericWorkoutStartedEvent,
    ];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.revisionHeaders(events.length),
        body: JSON.stringify(mocks.loggedSet),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "workout.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WorkoutExerciseExists", async () => {
    const events = [
      mocks.GenericWorkoutCreatedEvent,
      mocks.GenericWorkoutExerciseAddedEvent,
      mocks.GenericWorkoutExerciseTargetSetEvent,
      mocks.GenericWorkoutStartedEvent,
    ];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      `/api/workouts/${mocks.workoutId}/exercise/${mocks.anotherWorkoutExerciseId}/set`,
      {
        method: "POST",
        headers: mocks.revisionHeaders(events.length),
        body: JSON.stringify(mocks.loggedSet),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "workout.exercise.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("revision mismatch", async () => {
    const events = [
      mocks.GenericWorkoutCreatedEvent,
      mocks.GenericWorkoutExerciseAddedEvent,
      mocks.GenericWorkoutExerciseTargetSetEvent,
      mocks.GenericWorkoutStartedEvent,
    ];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(99), body: JSON.stringify(mocks.loggedSet) },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 412, "revision.mismatch");
  });

  test("happy path", async () => {
    const events = [
      mocks.GenericWorkoutCreatedEvent,
      mocks.GenericWorkoutExerciseAddedEvent,
      mocks.GenericWorkoutExerciseTargetSetEvent,
      mocks.GenericWorkoutStartedEvent,
    ];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate")).mockReturnValue(mocks.loggedSetId);
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.correlationIdAndRevisionHeaders(events.length),
        body: JSON.stringify(mocks.loggedSet),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWorkoutSetLoggedEvent]);
  });
});
