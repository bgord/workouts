import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/plans/${mocks.planId}/section`;

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
      "/api/plans/id/section",
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

  test("validation - name - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "POST", body: JSON.stringify({}) }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "plan.section.name.type", _known: true });
  });

  test("validation - name - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ planSectionName: "a".repeat(129) }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "plan.section.name.invalid", _known: true });
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
        body: JSON.stringify({ planSectionName: mocks.planSectionName }),
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
        body: JSON.stringify({ planSectionName: mocks.planSectionName }),
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
        body: JSON.stringify({ planSectionName: mocks.planSectionName }),
        headers: mocks.revisionHeaders(2),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.is.editable");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanIsEditable", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue([mocks.GenericPlanCreatedEvent]);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ planSectionName: mocks.planSectionName }),
        headers: mocks.revisionHeaders(1),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanSectionLimitForPlan", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Tools.EventStore, "find"))
      .mockResolvedValue([
        mocks.GenericPlanCreatedEvent,
        ...tools.repeat(mocks.GenericPlanSectionCreatedEvent, 6),
      ]);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ planSectionName: mocks.planSectionName }),
        headers: mocks.correlationIdAndRevisionHeaders(7),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.section.limit.for.plan");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanSectionNameIsUniqueForPlan", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Tools.EventStore, "find"))
      .mockResolvedValue([mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent]);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ planSectionName: mocks.planSectionName }),
        headers: mocks.correlationIdAndRevisionHeaders(2),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.section.name.is.unique.for.plan");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path - first", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate")).mockReturnValueOnce(mocks.planSectionId);
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue([mocks.GenericPlanCreatedEvent]);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.correlationIdAndRevisionHeaders(1),
        body: JSON.stringify({ planSectionName: mocks.planSectionName }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericPlanSectionCreatedEvent]);
  });

  test("happy path - at the limit", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.System.IdProvider, "generate"))
      .mockReturnValueOnce(mocks.anotherPlanSectionId);
    spies
      .use(spyOn(di.Tools.EventStore, "find"))
      .mockResolvedValue([
        mocks.GenericPlanCreatedEvent,
        ...tools.repeat(mocks.GenericPlanSectionCreatedEvent, 5),
      ]);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.correlationIdAndRevisionHeaders(6),
        body: JSON.stringify({ planSectionName: mocks.anotherPlanSectionName }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericPlanSectionCreatedEventSecond]);
  });
});
