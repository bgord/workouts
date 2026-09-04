import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/workouts/create";

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

  test("validation - planId - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "POST", body: JSON.stringify({}) }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: bg.UUIDError.Type });
  });

  test("validation - planSectionId - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ planId: mocks.planId }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: bg.UUIDError.Type });
  });

  test("validation - scheduledFor - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ planId: mocks.planId, planSectionId: mocks.planSectionId }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: tools.DayIsoIdError.Type });
  });

  test("validation - scheduledFor - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          planId: mocks.planId,
          planSectionId: mocks.planSectionId,
          scheduledFor: "01-01-2025",
        }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: tools.DayIsoIdError.BadChars });
  });

  test("WorkoutScheduledForIsNotPast", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          planId: mocks.planId,
          planSectionId: mocks.planSectionId,
          scheduledFor: "2024-12-31",
        }),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "workout.scheduled.for.is.not.past");
  });

  test("WorkoutScheduledForIsWithinHorizon", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          planId: mocks.planId,
          planSectionId: mocks.planSectionId,
          scheduledFor: "2999-12-31",
        }),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "workout.scheduled.for.is.within.horizon");
  });

  test("WorkoutPlanReady", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Plans.GetFinalizedPlanQuery, "execute")).mockResolvedValue(null);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          planId: mocks.planId,
          planSectionId: mocks.planSectionId,
          scheduledFor: mocks.workoutScheduledFor,
        }),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 404, "workout.plan.ready");
  });

  test("WorkoutPlanSectionReady", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Plans.GetFinalizedPlanQuery, "execute")).mockResolvedValue(mocks.plan);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          planId: mocks.planId,
          planSectionId: mocks.thirdPlanSectionId,
          scheduledFor: mocks.workoutScheduledFor,
        }),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 404, "workout.plan.section.ready");
  });

  test("WorkoutDraftLimitForOwner", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Plans.GetFinalizedPlanQuery, "execute")).mockResolvedValue(mocks.plan);
    spies
      .use(spyOn(di.Adapters.Workouts.GetWorkoutDraftForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(3));

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          planId: mocks.planId,
          planSectionId: mocks.planSectionId,
          scheduledFor: mocks.workoutScheduledFor,
        }),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "workout.draft.limit.for.owner");
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.System.IdProvider, "generate"))
      .mockReturnValueOnce(mocks.workoutId)
      .mockReturnValue(mocks.workoutExerciseId);
    spies.use(spyOn(di.Adapters.Plans.GetFinalizedPlanQuery, "execute")).mockResolvedValue(mocks.plan);
    spies
      .use(spyOn(di.Adapters.Workouts.GetWorkoutDraftForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({
          planId: mocks.planId,
          planSectionId: mocks.planSectionId,
          scheduledFor: mocks.workoutScheduledFor,
        }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([
      mocks.GenericWorkoutCreatedEvent,
      mocks.GenericWorkoutExerciseAddedEvent,
    ]);
  });

  test("happy path - plan section filled to the instruction limit", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.System.IdProvider, "generate"))
      .mockReturnValueOnce(mocks.workoutId)
      .mockReturnValue(mocks.workoutExerciseId);
    spies
      .use(spyOn(di.Adapters.Plans.GetFinalizedPlanQuery, "execute"))
      .mockResolvedValue(mocks.planAtInstructionLimit);
    spies
      .use(spyOn(di.Adapters.Workouts.GetWorkoutDraftForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({
          planId: mocks.planId,
          planSectionId: mocks.planSectionId,
          scheduledFor: mocks.workoutScheduledFor,
        }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave.mock.calls[0]?.[0]).toHaveLength(Workouts.VO.WorkoutExerciseLimitMax + 1);
  });

  test("happy path - at the limit", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.System.IdProvider, "generate"))
      .mockReturnValueOnce(mocks.workoutId)
      .mockReturnValue(mocks.workoutExerciseId);
    spies.use(spyOn(di.Adapters.Plans.GetFinalizedPlanQuery, "execute")).mockResolvedValue(mocks.plan);
    spies
      .use(spyOn(di.Adapters.Workouts.GetWorkoutDraftForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(2));

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({
          planId: mocks.planId,
          planSectionId: mocks.planSectionId,
          scheduledFor: mocks.workoutScheduledFor,
        }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([
      mocks.GenericWorkoutCreatedEvent,
      mocks.GenericWorkoutExerciseAddedEvent,
    ]);
  });
});
