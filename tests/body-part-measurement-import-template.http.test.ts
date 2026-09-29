import { describe, expect, spyOn, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/measurements/body-part/import/template";

describe(`GET ${url}`, async () => {
  const di = await bootstrap();
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("happy path", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Measurements.ListBodyPartNamesQuery, "execute").mockResolvedValue([
        mocks.bodyPartName,
        mocks.anotherBodyPartName,
      ]),
    );

    const response = await server.request(url, { method: "GET" }, mocks.ip);

    expect(response.status).toEqual(200);
    expect(response.headers.get("content-type")).toEqual("text/csv");
    expect(response.headers.get("content-disposition")).toEqual(
      'attachment; filename="body-part-measurements-template.csv"',
    );
    expect(await response.text()).toEqualIgnoringWhitespace(mocks.bodyPartMeasurementImportTemplateCsv);
  });
});
