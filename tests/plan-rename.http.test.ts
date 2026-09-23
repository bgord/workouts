import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/plans/${mocks.planId}/rename`;

describe("POST /api/plans/:planId/rename", async () => {
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

    const response = await server.request(
      "/api/plans/id/rename",
      { method: "POST", body: JSON.stringify({}) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("validation - planName - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({}), headers: mocks.revisionHeaders() },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "plan.name.type");
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

    await testcases.assertErrorResponse(response, 400, "plan.name.invalid");
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

    await testcases.assertErrorResponse(response, 403, "plan.name.is.unique.for.owner");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanExists", async () => {
    const events = [] as const;
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Plans.GetPlanNameForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.revisionHeaders(events.length),
        body: JSON.stringify({ planName: mocks.anotherPlanName }),
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
    spies
      .use(spyOn(di.Adapters.Plans.GetPlanNameForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.revisionHeaders(events.length),
        body: JSON.stringify({ planName: mocks.anotherPlanName }),
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
    spies
      .use(spyOn(di.Adapters.Plans.GetPlanNameForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.revisionHeaders(events.length),
        body: JSON.stringify({ planName: mocks.anotherPlanName }),
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
    spies
      .use(spyOn(di.Adapters.Plans.GetPlanNameForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.revisionHeaders(events.length),
        body: JSON.stringify({ planName: mocks.anotherPlanName }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "plan.belongs.to.user");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("PlanNameHasChanged", async () => {
    const events = [mocks.GenericPlanCreatedEvent];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.Plans.GetPlanNameForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.revisionHeaders(events.length),
        body: JSON.stringify({ planName: mocks.planName }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 403, "plan.name.has.changed");
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("revision mismatch", async () => {
    const events = [mocks.GenericPlanCreatedEvent];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.System.IdProvider, "generate"))
      .mockReturnValueOnce(mocks.anotherPlanSectionId);
    spies
      .use(spyOn(di.Adapters.Plans.GetPlanNameForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: { ...mocks.revisionHeaders(99), ...mocks.correlationIdHeaders },
        body: JSON.stringify({ planName: mocks.anotherPlanName }),
      },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 412, "revision.mismatch");
  });

  test("happy path", async () => {
    const events = [mocks.GenericPlanCreatedEvent];
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.System.IdProvider, "generate"))
      .mockReturnValueOnce(mocks.anotherPlanSectionId);
    const getPlanNameForOwnerCount = spies
      .use(spyOn(di.Adapters.Plans.GetPlanNameForOwnerCountQuery, "execute"))
      .mockResolvedValue(tools.Int.nonNegative(0));
    spies.use(spyOn(di.Tools.EventStore, "find")).mockResolvedValue(events);

    const response = await server.request(
      url,
      {
        method: "POST",
        headers: { ...mocks.revisionHeaders(events.length), ...mocks.correlationIdHeaders },
        body: JSON.stringify({ planName: mocks.anotherPlanName }),
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(getPlanNameForOwnerCount).toHaveBeenCalledWith(mocks.anotherPlanName, mocks.userId, mocks.planId);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericPlanRenamedEvent]);
  });
});
