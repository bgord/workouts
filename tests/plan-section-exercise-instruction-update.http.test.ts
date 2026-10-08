import { describe, expect, spyOn, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/plans/${mocks.planId}/section/${mocks.planSectionId}/exercise-instruction/${mocks.exerciseInstructionId}`;

describe("PATCH /api/plans/:planId/section/:planSectionId/exercise-instruction/:exerciseInstructionId", async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "PATCH" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - incorrect plan id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      `/api/plans/id/section/${mocks.planSectionId}/exercise-instruction/${mocks.exerciseInstructionId}`,
      { method: "PATCH", body: JSON.stringify({}) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("validation - incorrect plan section id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      `/api/plans/${mocks.planId}/section/id/exercise-instruction/${mocks.exerciseInstructionId}`,
      { method: "PATCH", body: JSON.stringify({}) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("validation - incorrect exercise instruction id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      `/api/plans/${mocks.planId}/section/${mocks.planSectionId}/exercise-instruction/id`,
      { method: "PATCH", body: JSON.stringify({}) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("validation - exerciseId - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "PATCH", headers: mocks.revisionHeaders(), body: JSON.stringify({}) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("validation - exerciseId - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "PATCH", headers: mocks.revisionHeaders(), body: JSON.stringify({ exerciseId: 0 }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("validation - sets - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.revisionHeaders(),
        body: JSON.stringify({ exerciseId: mocks.exerciseId }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "integer.positive.type");
  });

  test("validation - sets - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.revisionHeaders(),
        body: JSON.stringify({ exerciseId: mocks.exerciseId, sets: 0 }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "integer.positive.invalid");
  });

  test("validation - reps - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.revisionHeaders(),
        body: JSON.stringify({ exerciseId: mocks.exerciseId, sets: mocks.sets }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "reps.range.type");
  });

  test("validation - sets - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.revisionHeaders(),
        body: JSON.stringify({ exerciseId: mocks.exerciseId, sets: mocks.sets, reps: { min: 0, max: 0 } }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "integer.positive.invalid");
  });

  test("validation - sets - range", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.revisionHeaders(),
        body: JSON.stringify({ exerciseId: mocks.exerciseId, sets: mocks.sets, reps: { min: 2, max: 1 } }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "reps.range.invalid");
  });

  test("validation - progression - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.revisionHeaders(),
        body: JSON.stringify({
          exerciseId: mocks.exerciseId,
          sets: mocks.sets,
          reps: mocks.repsRange,
          progression: "linear",
        }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "progression.method.invalid");
  });

  test("validation - rir - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.revisionHeaders(),
        body: JSON.stringify({
          exerciseId: mocks.exerciseId,
          sets: mocks.sets,
          reps: mocks.repsRange,
          progression: mocks.progression,
          rir: 6,
        }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "rir.target.range");
  });

  test("PlanExists", async () => {
    const events = [] as const;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify(mocks.anotherExerciseInstruction),
        headers: mocks.revisionHeaders(events.length),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 404, "plan.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanSectionExerciseExists", async () => {
    const events = mocks.planWithExerciseInstructionHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(null);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify(mocks.anotherExerciseInstructionAndExercise),
        headers: mocks.revisionHeaders(events.length),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "plan.section.exercise.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanSectionExerciseInstructionProgressionIsApplicable", async () => {
    const events = mocks.planWithExerciseInstructionHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);
    spies
      .use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute"))
      .mockResolvedValue(mocks.bodyweightExercise);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify({
          ...mocks.anotherExerciseInstructionAndExercise,
          progression: mocks.anotherProgression,
        }),
        headers: mocks.headers(events.length),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(
      response,
      403,
      "plan.section.exercise.instruction.progression.is.applicable",
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanIsEditable - archived", async () => {
    const events = mocks.planArchivedHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify(mocks.anotherExerciseInstruction),
        headers: mocks.revisionHeaders(events.length),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "plan.is.editable");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanIsEditable - finalized", async () => {
    const events = mocks.planFinalizedHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify(mocks.anotherExerciseInstruction),
        headers: mocks.revisionHeaders(events.length),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "plan.is.editable");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanBelongsToUser", async () => {
    const events = [mocks.GenericPlanCreatedEvent];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify(mocks.anotherExerciseInstruction),
        headers: mocks.revisionHeaders(events.length),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "plan.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanSectionExists", async () => {
    const events = [mocks.GenericPlanCreatedEvent];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify(mocks.anotherExerciseInstruction),
        headers: mocks.headers(events.length),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "plan.section.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanSectionExerciseInstructionExists", async () => {
    const events = mocks.planWithExerciseInstructionHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);

    const response = await server.request(
      `/api/plans/${mocks.planId}/section/${mocks.planSectionId}/exercise-instruction/${mocks.anotherExerciseInstructionId}`,
      {
        method: "PATCH",
        body: JSON.stringify(mocks.anotherExerciseInstruction),
        headers: mocks.headers(events.length),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "plan.section.exercise.instruction.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanSectionExerciseInstructionHasChanged", async () => {
    const events = mocks.planWithExerciseInstructionHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify(mocks.exerciseInstruction),
        headers: mocks.headers(events.length),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "plan.section.exercise.instruction.has.changed");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanSectionExerciseInstructionProgressionIsApplicableForReps", async () => {
    const events = mocks.planWithExerciseInstructionHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify(mocks.amrapDoubleProgressionExerciseInstruction),
        headers: mocks.headers(events.length),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(
      response,
      403,
      "plan.section.exercise.instruction.progression.is.applicable.for.reps",
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanSectionExerciseInstructionRirIsApplicableForReps", async () => {
    const events = mocks.planWithExerciseInstructionHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify(mocks.amrapRirExerciseInstruction),
        headers: mocks.headers(events.length),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(
      response,
      403,
      "plan.section.exercise.instruction.rir.is.applicable.for.reps",
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("revision mismatch", async () => {
    const events = mocks.planWithExerciseInstructionHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.headers(99),
        body: JSON.stringify(mocks.anotherExerciseInstruction),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 412, "revision.mismatch");
  });

  test("happy path", async () => {
    const events = mocks.planWithExerciseInstructionHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.headers(events.length),
        body: JSON.stringify(mocks.anotherExerciseInstruction),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericPlanSectionExerciseInstructionUpdatedEvent]);
  });

  test("happy path - only the rir changed", async () => {
    const events = mocks.planWithExerciseInstructionHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.headers(events.length),
        body: JSON.stringify(mocks.rirExerciseInstruction),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([
      {
        ...mocks.GenericPlanSectionExerciseInstructionUpdatedEvent,
        payload: {
          ...mocks.GenericPlanSectionExerciseInstructionUpdatedEvent.payload,
          exerciseInstruction: {
            id: mocks.exerciseInstructionId,
            reps: mocks.repsRange,
            sets: mocks.sets,
            progression: mocks.progression,
            rir: mocks.rirTarget,
          },
        },
      },
    ]);
  });

  test("happy path - only the exercise changed", async () => {
    const events = mocks.planWithExerciseInstructionHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);
    spies.use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute")).mockResolvedValue(mocks.exercise);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.headers(events.length),
        body: JSON.stringify(mocks.anotherExerciseInstructionAndExercise),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([
      mocks.GenericPlanSectionExerciseInstructionExerciseChangedEvent,
    ]);
  });

  test("happy path - the exercise and the progression changed", async () => {
    const events = mocks.planWithLinearExerciseInstructionHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);
    spies
      .use(spyOn(di.Adapters.Exercises.GetExerciseQuery, "execute"))
      .mockResolvedValue(mocks.bodyweightExercise);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.headers(events.length),
        body: JSON.stringify({ ...mocks.anotherExerciseInstruction, exerciseId: mocks.anotherExerciseId }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([
      mocks.GenericPlanSectionExerciseInstructionExerciseChangedEvent,
      mocks.GenericPlanSectionExerciseInstructionUpdatedEvent,
    ]);
  });
});
