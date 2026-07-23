import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/plans/draft";

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
    expect(json).toEqual({ message: "plan.name.type", _known: true });
  });
  //
  test("validation - name - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ name: "a".repeat(129) }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "plan.name.invalid", _known: true });
  });

  test("PlanLimitForOwner", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Plans.GetPlanEditableForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(2));
    spies
      .use(spyOn(di.Adapters.Plans.GetPlanNameForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ name: mocks.planName }) },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.limit.for.owner");
  });

  test("PlanNameIsUniqueForOwner", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Plans.GetPlanEditableForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));
    spies
      .use(spyOn(di.Adapters.Plans.GetPlanNameForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(1));

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ name: mocks.planName }) },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.name.is.unique.for.owner");
  });

  test("happy path - no plans", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate")).mockReturnValueOnce(mocks.planId);
    spies
      .use(spyOn(di.Adapters.Plans.GetPlanEditableForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));
    spies
      .use(spyOn(di.Adapters.Plans.GetPlanNameForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({ name: mocks.planName }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericPlanDraftCreatedEvent]);
  });

  test("happy path - one plan", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate")).mockReturnValueOnce(mocks.planId);
    spies
      .use(spyOn(di.Adapters.Plans.GetPlanEditableForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(1));
    spies
      .use(spyOn(di.Adapters.Plans.GetPlanNameForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.correlationIdHeaders,
        body: JSON.stringify({ name: mocks.planName }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericPlanDraftCreatedEvent]);
  });
});
