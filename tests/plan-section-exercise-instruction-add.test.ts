import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/plans/${mocks.planId}/section/${mocks.planSectionId}/exercise-instruction`;

describe(`POST ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.ShieldAuthStrategyError.Rejected, _known: true });
  });

  test("validation - incorrect plan id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      `/api/plans/id/section/${mocks.planSectionId}/exercise-instruction`,
      { method: "POST", body: JSON.stringify({}) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type", _known: true });
  });

  test("validation - incorrect plan section id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      `/api/plans/${mocks.planId}/section/id/exercise-instruction`,
      { method: "POST", body: JSON.stringify({}) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type", _known: true });
  });

  test("validation - empty payload", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(url, { method: "POST" }, mocks.ip);

    expect(response.status).toEqual(500);
  });

  test("validation - exerciseId - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "POST", body: JSON.stringify({}) }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type", _known: true });
  });

  test("validation - exerciseId - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ exerciseId: "a".repeat(129) }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type", _known: true });
  });

  test("validation - sets - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ exerciseId: mocks.exerciseId }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "integer.positive.type", _known: true });
  });

  test("validation - sets - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ exerciseId: mocks.exerciseId, sets: 0 }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "integer.positive.invalid", _known: true });
  });

  test("validation - reps - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ exerciseId: mocks.exerciseId, sets: mocks.sets }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "reps.type", _known: true });
  });

  test("validation - sets - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ exerciseId: mocks.exerciseId, sets: mocks.sets, reps: { min: 0, max: 0 } }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "integer.positive.invalid", _known: true });
  });

  test("validation - sets - range", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ exerciseId: mocks.exerciseId, sets: mocks.sets, reps: { min: 2, max: 1 } }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "reps.range", _known: true });
  });

  test("PlanIsEditable - initial", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue([]);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ exerciseId: mocks.exerciseId, sets: mocks.sets, reps: mocks.reps }),
        headers: mocks.revisionHeaders(),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.is.editable");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanIsEditable - archived", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Tools.EventStore, "find"))
      .mockResolvedValue([mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent]);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ exerciseId: mocks.exerciseId, sets: mocks.sets, reps: mocks.reps }),
        headers: mocks.revisionHeaders(2),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.is.editable");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanIsEditable - finalized", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Tools.EventStore, "find"))
      .mockResolvedValue([mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent]);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ exerciseId: mocks.exerciseId, sets: mocks.sets, reps: mocks.reps }),
        headers: mocks.revisionHeaders(2),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.is.editable");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanBelongsToUser", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue([mocks.GenericPlanCreatedEvent]);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ exerciseId: mocks.exerciseId, sets: mocks.sets, reps: mocks.reps }),
        headers: mocks.revisionHeaders(1),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanSectionExists", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue([mocks.GenericPlanCreatedEvent]);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ exerciseId: mocks.exerciseId, sets: mocks.sets, reps: mocks.reps }),
        headers: mocks.correlationIdAndRevisionHeaders(1),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.section.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanSectionExerciseInstructionLimit", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Tools.EventStore, "find"))
      .mockResolvedValue([
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        ...tools.repeat(mocks.GenericPlanSectionExerciseInstructionAddedEvent, 20),
      ]);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ exerciseId: mocks.exerciseId, sets: mocks.sets, reps: mocks.reps }),
        headers: mocks.correlationIdAndRevisionHeaders(22),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.section.exercise.instruction.limit");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path - first", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.System.IdProvider, "generate"))
      .mockReturnValueOnce(mocks.exerciseInstructionId);
    spies
      .use(spyOn(di.Tools.EventStore, "find"))
      .mockResolvedValue([mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent]);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.correlationIdAndRevisionHeaders(2),
        body: JSON.stringify({ exerciseId: mocks.exerciseId, sets: mocks.sets, reps: mocks.reps }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericPlanSectionExerciseInstructionAddedEvent]);
  });

  test("happy path - at the limit", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.System.IdProvider, "generate"))
      .mockReturnValueOnce(mocks.exerciseInstructionId);
    spies
      .use(spyOn(di.Tools.EventStore, "find"))
      .mockResolvedValue([
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        ...tools.repeat(mocks.GenericPlanSectionExerciseInstructionAddedEvent, 19),
      ]);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.correlationIdAndRevisionHeaders(21),
        body: JSON.stringify({ exerciseId: mocks.exerciseId, sets: mocks.sets, reps: mocks.reps }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericPlanSectionExerciseInstructionAddedEvent]);
  });
});
