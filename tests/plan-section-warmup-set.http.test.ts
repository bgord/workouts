import { describe, expect, spyOn, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/plans/${mocks.planId}/section/${mocks.planSectionId}/warmup`;

describe("PATCH /api/plans/:planId/section/:planSectionId/warmup", async () => {
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
      `/api/plans/id/section/${mocks.planSectionId}/warmup`,
      { method: "PATCH", body: JSON.stringify({ warmup: mocks.planSectionWarmup }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type" });
  });

  test("validation - incorrect plan section id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      `/api/plans/${mocks.planId}/section/id/warmup`,
      { method: "PATCH", body: JSON.stringify({ warmup: mocks.planSectionWarmup }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type" });
  });

  test("validation - warmup - wrong type", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "PATCH", headers: mocks.revisionHeaders(), body: JSON.stringify({ warmup: 2024 }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "plan.section.warmup.type" });
  });

  test("validation - warmup - empty", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "PATCH", headers: mocks.revisionHeaders(), body: JSON.stringify({ warmup: "" }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "plan.section.warmup.invalid" });
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
        headers: mocks.revisionHeaders(events.length),
        body: JSON.stringify({ warmup: mocks.planSectionWarmup }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 404, "plan.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanIsEditable - archived", async () => {
    const events = mocks.planArchivedHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.revisionHeaders(events.length),
        body: JSON.stringify({ warmup: mocks.planSectionWarmup }),
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

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.revisionHeaders(events.length),
        body: JSON.stringify({ warmup: mocks.planSectionWarmup }),
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

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.revisionHeaders(events.length),
        body: JSON.stringify({ warmup: mocks.planSectionWarmup }),
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

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.revisionHeaders(events.length),
        body: JSON.stringify({ warmup: mocks.planSectionWarmup }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "plan.section.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanSectionWarmupHasChanged", async () => {
    const events = [
      mocks.GenericPlanCreatedEvent,
      mocks.GenericPlanSectionCreatedEvent,
      mocks.GenericPlanSectionWarmupSetEvent,
    ];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.revisionHeaders(events.length),
        body: JSON.stringify({ warmup: mocks.planSectionWarmup }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "plan.section.warmup.has.changed");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanSectionWarmupHasChanged - clearing an absent warmup", async () => {
    const events = mocks.planWithSectionHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.revisionHeaders(events.length),
        body: JSON.stringify({ warmup: null }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "plan.section.warmup.has.changed");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("revision mismatch", async () => {
    const events = mocks.planWithSectionHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: mocks.revisionHeaders(99),
        body: JSON.stringify({ warmup: mocks.planSectionWarmup }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 412, "revision.mismatch");
  });

  test("happy path", async () => {
    const events = mocks.planWithSectionHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: { ...mocks.revisionHeaders(events.length), ...mocks.correlationIdHeaders },
        body: JSON.stringify({ warmup: mocks.planSectionWarmup }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericPlanSectionWarmupSetEvent]);
  });

  test("happy path - clears the warmup", async () => {
    const events = [
      mocks.GenericPlanCreatedEvent,
      mocks.GenericPlanSectionCreatedEvent,
      mocks.GenericPlanSectionWarmupSetEvent,
    ];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "PATCH",
        headers: { ...mocks.revisionHeaders(events.length), ...mocks.correlationIdHeaders },
        body: JSON.stringify({ warmup: null }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericPlanSectionWarmupUnsetEvent]);
  });
});
