import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/plans/${mocks.planId}/section/${mocks.planSectionId}/exercise-instruction/${mocks.exerciseInstructionId}`;

describe(`DELETE ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "DELETE" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(401);
    expect(json).toEqual({ message: bg.ShieldAuthStrategyError.Rejected, _known: true });
  });

  test("validation - incorrect plan id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      `/api/plans/id/section/${mocks.planSectionId}/exercise-instruction/${mocks.exerciseInstructionId}`,
      { method: "DELETE" },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type", _known: true });
  });

  test("validation - incorrect plan section id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      `/api/plans/${mocks.planId}/section/id/exercise-instruction/${mocks.exerciseInstructionId}`,
      { method: "DELETE" },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type", _known: true });
  });

  test("validation - incorrect exercise instruction id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      `/api/plans/${mocks.planId}/section/${mocks.planSectionId}/exercise-instruction/id`,
      { method: "DELETE" },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type", _known: true });
  });

  test("PlanIsEditable - initial", async () => {
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

    await testcases.assertInvariantError(response, 403, "plan.is.editable");
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
      { method: "DELETE", headers: mocks.revisionHeaders(events.length) },
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
      { method: "DELETE", headers: mocks.revisionHeaders(events.length) },
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
      { method: "DELETE", headers: mocks.revisionHeaders(events.length) },
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
      { method: "DELETE", headers: mocks.correlationIdAndRevisionHeaders(events.length) },
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
      `/api/plans/${mocks.planId}/section/${mocks.planSectionId}/exercise-instruction/${mocks.anotherExerciseInstructionId}`,
      { method: "DELETE", headers: mocks.correlationIdAndRevisionHeaders(events.length) },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.section.exercise.instruction.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("revision mismatch", async () => {
    const events = [
      mocks.GenericPlanCreatedEvent,
      mocks.GenericPlanSectionCreatedEvent,
      mocks.GenericPlanSectionExerciseInstructionAddedEvent,
    ];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      { method: "DELETE", headers: mocks.correlationIdAndRevisionHeaders(99) },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 412, "revision.mismatch");
  });

  test("happy path", async () => {
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
      { method: "DELETE", headers: mocks.correlationIdAndRevisionHeaders(events.length) },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericPlanSectionExerciseInstructionRemovedEvent]);
  });
});
