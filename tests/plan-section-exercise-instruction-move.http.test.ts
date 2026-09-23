import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/plans/${mocks.planId}/section/${mocks.planSectionId}/exercise-instruction/${mocks.exerciseInstructionId}/position`;

describe("PATCH /api/plans/:planId/section/:planSectionId/exercise-instruction/:exerciseInstructionId/position", async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "PATCH" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(401);
    expect(json).toEqual({ message: bg.ShieldAuthStrategyError.Rejected });
  });

  test("validation - incorrect plan id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      `/api/plans/id/section/${mocks.planSectionId}/exercise-instruction/${mocks.exerciseInstructionId}/position`,
      { method: "PATCH", body: JSON.stringify({}) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type" });
  });

  test("validation - incorrect plan section id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      `/api/plans/${mocks.planId}/section/id/exercise-instruction/${mocks.exerciseInstructionId}/position`,
      { method: "PATCH", body: JSON.stringify({}) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type" });
  });

  test("validation - incorrect exercise instruction id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      `/api/plans/${mocks.planId}/section/${mocks.planSectionId}/exercise-instruction/id/position`,
      { method: "PATCH", body: JSON.stringify({}) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type" });
  });

  test("validation - position - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "PATCH", headers: mocks.revisionHeaders(), body: JSON.stringify({}) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "integer.non.negative.type" });
  });

  test("validation - position - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "PATCH", headers: mocks.revisionHeaders(), body: JSON.stringify({ position: -1 }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "integer.non.negative.invalid" });
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
        body: JSON.stringify({ position: mocks.anotherExerciseInstructionPosition }),
        headers: mocks.revisionHeaders(events.length),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 404, "plan.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanIsEditable - archived", async () => {
    const events = [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify({ position: mocks.anotherExerciseInstructionPosition }),
        headers: mocks.revisionHeaders(events.length),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.is.editable");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanIsEditable - finalized", async () => {
    const events = [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify({ position: mocks.anotherExerciseInstructionPosition }),
        headers: mocks.revisionHeaders(events.length),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.is.editable");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanBelongsToUser", async () => {
    const events = [mocks.GenericPlanCreatedEvent];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify({ position: mocks.anotherExerciseInstructionPosition }),
        headers: mocks.revisionHeaders(events.length),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanSectionExists", async () => {
    const events = [mocks.GenericPlanCreatedEvent];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify({ position: mocks.anotherExerciseInstructionPosition }),
        headers: mocks.correlationIdAndRevisionHeaders(events.length),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.section.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanSectionExerciseInstructionExists", async () => {
    const events = [
      mocks.GenericPlanCreatedEvent,
      mocks.GenericPlanSectionCreatedEvent,
      mocks.GenericPlanSectionExerciseInstructionAddedEvent,
    ];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      `/api/plans/${mocks.planId}/section/${mocks.planSectionId}/exercise-instruction/${mocks.anotherExerciseInstructionId}/position`,
      {
        method: "PATCH",
        body: JSON.stringify({ position: mocks.exerciseInstructionPosition }),
        headers: mocks.correlationIdAndRevisionHeaders(events.length),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.section.exercise.instruction.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanSectionExerciseInstructionPositionInRange", async () => {
    const events = [
      mocks.GenericPlanCreatedEvent,
      mocks.GenericPlanSectionCreatedEvent,
      mocks.GenericPlanSectionExerciseInstructionAddedEvent,
    ];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify({ position: mocks.anotherExerciseInstructionPosition }),
        headers: mocks.correlationIdAndRevisionHeaders(events.length),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(
      response,
      403,
      "plan.section.exercise.instruction.position.in.range",
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanSectionExerciseInstructionPositionHasChanged", async () => {
    const events = [
      mocks.GenericPlanCreatedEvent,
      mocks.GenericPlanSectionCreatedEvent,
      mocks.GenericPlanSectionExerciseInstructionAddedEvent,
      mocks.GenericPlanSectionExerciseInstructionAddedEventThird,
    ];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        body: JSON.stringify({ position: mocks.exerciseInstructionPosition }),
        headers: mocks.correlationIdAndRevisionHeaders(events.length),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(
      response,
      403,
      "plan.section.exercise.instruction.position.has.changed",
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("revision mismatch", async () => {
    const events = [
      mocks.GenericPlanCreatedEvent,
      mocks.GenericPlanSectionCreatedEvent,
      mocks.GenericPlanSectionExerciseInstructionAddedEvent,
      mocks.GenericPlanSectionExerciseInstructionAddedEventThird,
    ];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.correlationIdAndRevisionHeaders(99),
        body: JSON.stringify({ position: mocks.anotherExerciseInstructionPosition }),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 412, "revision.mismatch");
  });

  test("happy path", async () => {
    const events = [
      mocks.GenericPlanCreatedEvent,
      mocks.GenericPlanSectionCreatedEvent,
      mocks.GenericPlanSectionExerciseInstructionAddedEvent,
      mocks.GenericPlanSectionExerciseInstructionAddedEventThird,
    ];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.correlationIdAndRevisionHeaders(events.length),
        body: JSON.stringify({ position: mocks.anotherExerciseInstructionPosition }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericPlanSectionExerciseInstructionMovedEvent]);
  });
});
