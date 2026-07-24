import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/plans/${mocks.planId}/editing/enable`;

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

    const response = await server.request("/api/plans/id/finalize", { method: "POST" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type", _known: true });
  });

  test("PlanIsFinalized - initial", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue([]);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders() },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.is.finalized");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanIsFinalized - draft", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue([mocks.GenericPlanCreatedEvent]);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(1) },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.is.finalized");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanIsFinalized - archived", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Tools.EventStore, "find"))
      .mockResolvedValue([mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent]);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(2) },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.is.finalized");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanBelongsToUser", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Tools.EventStore, "find"))
      .mockResolvedValue([mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent]);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(2) },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate")).mockReturnValueOnce(mocks.planSectionId);
    spies
      .use(spyOn(di.Tools.EventStore, "find"))
      .mockResolvedValue([mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent]);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.correlationIdAndRevisionHeaders(2) },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericPlanEditingEnabledEvent]);
  });
});
