import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/workouts/${mocks.workoutId}/exercise`;

const body = JSON.stringify({
  exerciseId: mocks.exerciseId,
  sets: mocks.exercisePrescription.sets,
  reps: mocks.exercisePrescription.reps,
});

const draft = [mocks.GenericWorkoutCreatedEvent] as const;

describe(`POST ${url}`, async () => {
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

  test("validation - exerciseId - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(draft.length), body: JSON.stringify({}) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: bg.UUIDError.Type });
  });

  test("validation - sets - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.revisionHeaders(draft.length),
        body: JSON.stringify({ exerciseId: mocks.exerciseId }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(400);
  });

  test("WorkoutCatalogExerciseExists", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(null);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(draft.length), body },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "workout.catalog.exercise.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WorkoutExists", async () => {
    const events = [] as const;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(events.length), body },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 404, "workout.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WorkoutIsEditable - completed", async () => {
    const events = [
      mocks.GenericWorkoutCreatedEvent,
      mocks.GenericWorkoutExerciseAddedEvent,
      mocks.GenericWorkoutExerciseTargetSetEvent,
      mocks.GenericWorkoutStartedEvent,
      mocks.GenericWorkoutSetLoggedEvent,
      mocks.GenericWorkoutCompletedEvent,
    ];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(events.length), body },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "workout.is.editable");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WorkoutBelongsToUser", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(draft);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(draft.length), body },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "workout.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WorkoutExerciseLimit", async () => {
    const events = [
      mocks.GenericWorkoutCreatedEvent,
      ...Array.from({ length: Workouts.VO.WorkoutExerciseLimitMax }, mocks.workoutExerciseAddedEvent),
    ];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(events.length), body },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "workout.exercise.limit");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("revision mismatch", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(draft);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(99), body },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 412, "revision.mismatch");
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate")).mockReturnValue(mocks.workoutExerciseId);
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(draft);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.correlationIdAndRevisionHeaders(draft.length), body },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWorkoutExerciseAddedEvent]);
  });

  test("happy path - in progress", async () => {
    const events = [
      mocks.GenericWorkoutCreatedEvent,
      mocks.GenericWorkoutExerciseAddedEvent,
      mocks.GenericWorkoutExerciseTargetSetEvent,
      mocks.GenericWorkoutStartedEvent,
    ];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.System.IdProvider, "generate"))
      .mockReturnValue(mocks.anotherWorkoutExerciseId);
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.correlationIdAndRevisionHeaders(events.length), body },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.AnotherGenericWorkoutExerciseAddedEvent]);
  });
});
