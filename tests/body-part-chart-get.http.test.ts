import { describe, expect, spyOn, test } from "bun:test";
import * as Measurements from "+measurements";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/measurements/body-part/chart";

describe(`QUERY ${url}`, async () => {
  const di = await bootstrap();
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "QUERY" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - bodyPartId - missing", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "QUERY", body: JSON.stringify({}) }, mocks.ip);

    await testcases.assertErrorResponse(response, 400, "uuid.type");
  });

  test("validation - granularity - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "QUERY", body: JSON.stringify({ bodyPartId: mocks.bodyPartId, granularity: "monthly" }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "body.part.chart.granularity.invalid");
  });

  test("happy path - weekly", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartMeasurementsQuery, "execute"))
      .mockResolvedValue([mocks.bodyPartMeasurement, mocks.heavierBodyPartMeasurement]);

    const response = await server.request(
      url,
      {
        method: "QUERY",
        body: JSON.stringify({
          bodyPartId: mocks.bodyPartId,
          granularity: Measurements.VO.BodyPartChartGranularityOptions.weekly,
        }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      points: [
        {
          from: mocks.anotherBodyPartMeasuredOn,
          to: mocks.bodyPartMeasuredOn,
          value: 1050,
          count: 2,
        },
      ],
    });
  });

  test("happy path - daily", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartMeasurementsQuery, "execute"))
      .mockResolvedValue([mocks.bodyPartMeasurement]);

    const response = await server.request(
      url,
      {
        method: "QUERY",
        body: JSON.stringify({
          bodyPartId: mocks.bodyPartId,
          granularity: Measurements.VO.BodyPartChartGranularityOptions.daily,
        }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      points: [
        {
          from: mocks.bodyPartMeasuredOn,
          to: mocks.bodyPartMeasuredOn,
          value: mocks.bodyPartMeasurementValue,
          count: 1,
        },
      ],
    });
  });

  test("happy path - filters by body part", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartMeasurementsQuery, "execute"))
      .mockResolvedValue([
        mocks.bodyPartMeasurement,
        { ...mocks.heavierBodyPartMeasurement, bodyPartId: mocks.anotherBodyPartId },
      ]);

    const response = await server.request(
      url,
      {
        method: "QUERY",
        body: JSON.stringify({
          bodyPartId: mocks.bodyPartId,
          granularity: Measurements.VO.BodyPartChartGranularityOptions.daily,
        }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      points: [
        {
          from: mocks.bodyPartMeasuredOn,
          to: mocks.bodyPartMeasuredOn,
          value: mocks.bodyPartMeasurementValue,
          count: 1,
        },
      ],
    });
  });

  test("happy path - empty", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Measurements.ListBodyPartMeasurementsQuery, "execute")).mockResolvedValue([]);

    const response = await server.request(
      url,
      {
        method: "QUERY",
        body: JSON.stringify({
          bodyPartId: mocks.bodyPartId,
          granularity: Measurements.VO.BodyPartChartGranularityOptions.weekly,
        }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({ points: [] });
  });
});
