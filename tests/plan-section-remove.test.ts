import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/plans/${mocks.planId}/section/${mocks.planSectionId}`;

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

  test("PlanIsEditable", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue([]);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders() },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.is.editable");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanIsEditable", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue([mocks.GenericPlanDraftCreatedEvent]);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(1) },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanSectionExists", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue([mocks.GenericPlanDraftCreatedEvent]);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.correlationIdAndRevisionHeaders(1) },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.section.exists");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.System.IdProvider, "generate"))
      .mockReturnValueOnce(mocks.anotherPlanSectionId);
    spies
      .use(spyOn(di.Tools.EventStore, "find"))
      .mockResolvedValue([mocks.GenericPlanDraftCreatedEvent, mocks.GenericPlanSectionCreatedEvent]);

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.correlationIdAndRevisionHeaders(2) },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericPlanSectionRemovedEvent]);
  });
});
