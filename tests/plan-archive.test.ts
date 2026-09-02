import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/plans/${mocks.planId}/archive`;

describe("POST /api/plans/:planId/archive", async () => {
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

  test("validation - incorrect plan id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      "/api/plans/id/archive",
      { method: "POST", body: JSON.stringify({}) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type" });
  });

  test("PlanIsArchivable - initial", async () => {
    const events = [] as const;

    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(events.length) },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.is.archivable");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanIsArchivable - archived", async () => {
    const events = [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(events.length) },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.is.archivable");
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
      { method: "POST", headers: mocks.revisionHeaders(events.length) },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("validation - revision mismatch", async () => {
    const events = [mocks.GenericPlanCreatedEvent];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.System.IdProvider, "generate"))
      .mockReturnValueOnce(mocks.anotherPlanSectionId);
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.correlationIdAndRevisionHeaders(99) },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 412, "revision.mismatch");
  });

  test("happy path - initial", async () => {
    const events = [mocks.GenericPlanCreatedEvent];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.System.IdProvider, "generate"))
      .mockReturnValueOnce(mocks.anotherPlanSectionId);
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.correlationIdAndRevisionHeaders(events.length) },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericPlanArchivedEvent]);
  });

  test("happy path - finalized", async () => {
    const events = [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.System.IdProvider, "generate"))
      .mockReturnValueOnce(mocks.anotherPlanSectionId);
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.correlationIdAndRevisionHeaders(events.length) },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericPlanArchivedEvent]);
  });
});
