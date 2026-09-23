import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/workouts/${mocks.workoutId}/start`;

describe("PATCH /api/workouts/:workoutId/start", async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "PATCH" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - incorrect workout id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request("/api/workouts/id/start", { method: "PATCH" }, mocks.ip);
    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("WorkoutExists", async () => {
    const events = [] as const;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);
    spies
      .use(spyOn(di.Adapters.Workouts.GetWorkoutStatusForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));

    const response = await server.request(
      url,
      { method: "PATCH", headers: mocks.revisionHeaders(events.length) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 404, "workout.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WorkoutInProgressLimitForOwner", async () => {
    const events = mocks.workoutWithTargetHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);
    spies
      .use(spyOn(di.Adapters.Workouts.GetWorkoutStatusForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(1));

    const response = await server.request(
      url,
      { method: "PATCH", headers: mocks.revisionHeaders(events.length) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "workout.in.progress.limit.for.owner");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WorkoutIsDraft", async () => {
    const events = mocks.workoutInProgressHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);
    spies
      .use(spyOn(di.Adapters.Workouts.GetWorkoutStatusForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));

    const response = await server.request(
      url,
      { method: "PATCH", headers: mocks.revisionHeaders(events.length) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "workout.is.draft");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WorkoutBelongsToUser", async () => {
    const events = mocks.workoutWithTargetHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);
    spies
      .use(spyOn(di.Adapters.Workouts.GetWorkoutStatusForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));

    const response = await server.request(
      url,
      { method: "PATCH", headers: mocks.revisionHeaders(events.length) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "workout.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WorkoutHasExercises", async () => {
    const events = [mocks.GenericWorkoutCreatedEvent];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);
    spies
      .use(spyOn(di.Adapters.Workouts.GetWorkoutStatusForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));

    const response = await server.request(
      url,
      { method: "PATCH", headers: mocks.revisionHeaders(events.length) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "workout.has.exercises");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WorkoutExercisesHaveTargets", async () => {
    const events = mocks.workoutWithExerciseHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);
    spies
      .use(spyOn(di.Adapters.Workouts.GetWorkoutStatusForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));

    const response = await server.request(
      url,
      { method: "PATCH", headers: mocks.revisionHeaders(events.length) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "workout.exercises.have.targets");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("revision mismatch", async () => {
    const events = mocks.workoutWithTargetHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      { method: "PATCH", headers: mocks.revisionHeaders(99) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 412, "revision.mismatch");
  });

  test("happy path", async () => {
    const events = mocks.workoutWithTargetHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);
    spies
      .use(spyOn(di.Adapters.Workouts.GetWorkoutStatusForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: { ...mocks.revisionHeaders(events.length), ...mocks.correlationIdHeaders },
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWorkoutStartedEvent]);
  });
});
