import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";

const url = `/api/plans/${mocks.planId}`;

describe("GET /api/plans/:planId", async () => {
  const di = await bootstrap();
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(401);
    expect(json).toEqual({ message: bg.ShieldAuthStrategyError.Rejected });
  });

  test("validation - incorrect plan id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request("/api/plans/id", { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "uuid.type" });
  });

  test("not found", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Plans.GetPlanQuery, "execute").mockResolvedValue(null));

    const response = await server.request(url, { method: "GET" }, mocks.ip);

    expect(response.status).toEqual(404);
  });

  test("happy path", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Plans.GetPlanQuery, "execute").mockResolvedValue({
        data: mocks.planWithSectionActions,
        actions: {
          finalize: { enabled: true, hints: [] },
          rename: { enabled: true, hints: [] },
          editingEnable: { enabled: false, hints: [] },
          archive: { enabled: true, hints: [] },
          restore: { enabled: false, hints: [] },
          remove: { enabled: true, hints: [] },
          sectionCreate: { enabled: true, hints: [] },
          sectionRename: { enabled: true, hints: [] },
          sectionRemove: { enabled: true, hints: [] },
        },
      }),
    );

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      data: mocks.planWithSectionActions,
      actions: {
        finalize: { enabled: true, hints: [] },
        rename: { enabled: true, hints: [] },
        editingEnable: { enabled: false, hints: [] },
        archive: { enabled: true, hints: [] },
        restore: { enabled: false, hints: [] },
        remove: { enabled: true, hints: [] },
        sectionCreate: { enabled: true, hints: [] },
        sectionRename: { enabled: true, hints: [] },
        sectionRemove: { enabled: true, hints: [] },
      },
    });
  });
});
