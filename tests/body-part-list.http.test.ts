import { describe, expect, spyOn, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/measurements/body-part/list";

describe(`QUERY ${url}`, async () => {
  const di = await bootstrap();
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "QUERY" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("happy path", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartsQuery, "execute"))
      .mockResolvedValue([mocks.bodyPart]);

    const response = await server.request(url, { method: "QUERY" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual([mocks.bodyPart]);
  });

  test("happy path - empty", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Measurements.ListBodyPartsQuery, "execute")).mockResolvedValue([]);

    const response = await server.request(url, { method: "QUERY" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual([]);
  });
});
