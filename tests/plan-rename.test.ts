import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/plans/${mocks.planId}/rename`;

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
      "/api/plans/id/rename",
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

  test("validation - planName - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({}), headers: mocks.revisionHeaders() },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "plan.name.type", _known: true });
  });

  test("validation - planName - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ planName: "a".repeat(129) }),
        headers: mocks.revisionHeaders(),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "plan.name.invalid", _known: true });
  });

  test("PlanNameIsUniqueForOwner", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Plans.GetPlanNameForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(1));

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.revisionHeaders(),
        body: JSON.stringify({ planName: mocks.anotherPlanName }),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.name.is.unique.for.owner");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanIsEditable - initial", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Plans.GetPlanNameForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue([]);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.revisionHeaders(),
        body: JSON.stringify({ planName: mocks.anotherPlanName }),
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
      .use(spyOn(di.Adapters.Plans.GetPlanNameForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));
    spies
      .use(spyOn(di.Tools.EventStore, "find"))
      .mockResolvedValue([mocks.GenericPlanDraftCreatedEvent, mocks.GenericPlanArchivedEvent]);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.revisionHeaders(2),
        body: JSON.stringify({ planName: mocks.anotherPlanName }),
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
      .use(spyOn(di.Adapters.Plans.GetPlanNameForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));
    spies
      .use(spyOn(di.Tools.EventStore, "find"))
      .mockResolvedValue([mocks.GenericPlanDraftCreatedEvent, mocks.GenericPlanFinalizedEvent]);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.revisionHeaders(2),
        body: JSON.stringify({ planName: mocks.anotherPlanName }),
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
    spies
      .use(spyOn(di.Adapters.Plans.GetPlanNameForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue([mocks.GenericPlanDraftCreatedEvent]);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.revisionHeaders(1),
        body: JSON.stringify({ planName: mocks.anotherPlanName }),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanNameHasChanged", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Plans.GetPlanNameForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue([mocks.GenericPlanDraftCreatedEvent]);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.revisionHeaders(1),
        body: JSON.stringify({ planName: mocks.planName }),
      },
      mocks.ip,
    );

    await testcases.assertInvariantError(response, 403, "plan.name.has.changed");
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
      .use(spyOn(di.Adapters.Plans.GetPlanNameForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue([mocks.GenericPlanDraftCreatedEvent]);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.correlationIdAndRevisionHeaders(1),
        body: JSON.stringify({ planName: mocks.anotherPlanName }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericPlanRenamedEvent]);
  });
});
