import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/plans/${mocks.planId}/history`;

describe("QUERY /api/plans/:planId/history", async () => {
  const di = await bootstrap();
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "QUERY" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - incorrect plan id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request("/api/plans/id/history", { method: "QUERY" }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("validation - incorrect before", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "QUERY", body: JSON.stringify({ before: "abc" }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "integer.non.negative.type");
  });

  test("validation - empty before", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "QUERY", body: JSON.stringify({ before: "" }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "integer.non.negative.type");
  });

  test("validation - negative before", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "QUERY", body: JSON.stringify({ before: -1 }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "integer.non.negative.invalid");
  });

  test("not found", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Plans.GetPlanHistoryQuery, "execute").mockResolvedValue(null));

    const response = await server.request(url, { method: "QUERY" }, mocks.ip);

    expect(response.status).toEqual(404);
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using getPlanHistory = spyOn(di.Adapters.Plans.GetPlanHistoryQuery, "execute").mockResolvedValue(
      mocks.planHistoryResponse,
    );

    const response = await server.request(url, { method: "QUERY" }, mocks.ip);

    expect(response.status).toEqual(200);
    expect(await response.json()).toEqual(mocks.planHistoryResponse);
    expect(getPlanHistory).toHaveBeenCalledWith(mocks.planId, mocks.userId, {
      before: undefined,
      limit: tools.Int.positive(20),
    });
  });

  test("happy path - before", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using getPlanHistory = spyOn(di.Adapters.Plans.GetPlanHistoryQuery, "execute").mockResolvedValue(
      mocks.planHistoryResponse,
    );

    const response = await server.request(
      url,
      { method: "QUERY", body: JSON.stringify({ before: 40 }) },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(getPlanHistory).toHaveBeenCalledWith(mocks.planId, mocks.userId, {
      before: tools.Int.nonNegative(40),
      limit: tools.Int.positive(20),
    });
  });
});
