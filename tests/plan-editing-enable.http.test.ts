import { describe, expect, spyOn, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/plans/${mocks.planId}/editing/enable`;

describe("POST /api/plans/:planId/editing/enable", async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - incorrect plan id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request("/api/plans/id/finalize", { method: "POST" }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("PlanExists", async () => {
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

    await testcases.assertErrorResponse(response, 404, "plan.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanIsFinalized - draft", async () => {
    const events = [mocks.GenericPlanCreatedEvent];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(events.length) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "plan.is.finalized");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanIsFinalized - archived", async () => {
    const events = mocks.planArchivedHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(events.length) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "plan.is.finalized");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanBelongsToUser", async () => {
    const events = mocks.planFinalizedHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(events.length) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "plan.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("validation - revision mismatch", async () => {
    const events = mocks.planFinalizedHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate")).mockReturnValueOnce(mocks.planSectionId);
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      { method: "POST", headers: { ...mocks.revisionHeaders(99), ...mocks.correlationIdHeaders } },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 412, "revision.mismatch");
  });

  test("happy path", async () => {
    const events = mocks.planFinalizedHistory;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate")).mockReturnValueOnce(mocks.planSectionId);
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      { method: "POST", headers: { ...mocks.revisionHeaders(events.length), ...mocks.correlationIdHeaders } },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericPlanEditingEnabledEvent]);
  });
});
