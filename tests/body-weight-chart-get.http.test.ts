import { describe, expect, spyOn, test } from "bun:test";
import * as Measurements from "+measurements";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/measurements/body-weight/chart";

describe(`QUERY ${url}`, async () => {
  const di = await bootstrap();
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "QUERY" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - granularity - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "QUERY", body: JSON.stringify({ granularity: "monthly" }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "body.weight.chart.granularity.invalid");
  });

  test("happy path", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Measurements.ListBodyWeightMeasurementsQuery, "execute").mockResolvedValue([
        mocks.bodyWeightMeasurement,
        mocks.heavierBodyWeightMeasurement,
      ]),
    );

    const response = await server.request(
      url,
      {
        method: "QUERY",
        body: JSON.stringify({ granularity: Measurements.VO.BodyWeightChartGranularityOptions.weekly }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      points: [
        {
          from: mocks.anotherBodyWeightMeasuredOn,
          to: mocks.bodyWeightMeasuredOn,
          weight: mocks.anotherBodyWeight,
          count: 2,
          reference: false,
        },
      ],
    });
  });

  test("happy path - daily", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Measurements.ListBodyWeightMeasurementsQuery, "execute").mockResolvedValue([
        mocks.bodyWeightMeasurement,
      ]),
    );

    const response = await server.request(
      url,
      {
        method: "QUERY",
        body: JSON.stringify({ granularity: Measurements.VO.BodyWeightChartGranularityOptions.daily }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      points: [
        {
          from: mocks.bodyWeightMeasuredOn,
          to: mocks.bodyWeightMeasuredOn,
          weight: mocks.bodyWeight,
          count: 1,
          reference: false,
        },
      ],
    });
  });

  test("happy path - empty", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Measurements.ListBodyWeightMeasurementsQuery, "execute").mockResolvedValue([]),
    );

    const response = await server.request(
      url,
      {
        method: "QUERY",
        body: JSON.stringify({ granularity: Measurements.VO.BodyWeightChartGranularityOptions.weekly }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({ points: [] });
  });
});
