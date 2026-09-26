import { describe, expect, spyOn, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/measurements/body-part/measurement/list";

describe(`QUERY ${url}`, async () => {
  const di = await bootstrap();
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "QUERY" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("validation - month - invalid", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      url,
      { method: "QUERY", body: JSON.stringify({ month: "2025-13" }) },
      mocks.ip,
    );

    await testcases.assertErrorResponse(response, 400, "body.part.history.month.invalid");
  });

  test("happy path", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartsQuery, "execute"))
      .mockResolvedValue([mocks.bodyPart]);
    spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartMonthsQuery, "execute"))
      .mockResolvedValue([mocks.bodyPartMonthSummary]);
    spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartMeasurementsForStatsQuery, "execute"))
      .mockResolvedValue([mocks.bodyPartMeasurement]);
    const listForMonth = spies.use(
      spyOn(di.Adapters.Measurements.ListBodyPartMeasurementsForMonthQuery, "execute").mockResolvedValue({
        measurements: [mocks.bodyPartMeasurement],
        previous: mocks.heavierBodyPartMeasurement,
      }),
    );

    const response = await server.request(url, { method: "QUERY", body: JSON.stringify({}) }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(listForMonth).toHaveBeenCalledWith(mocks.userId, "2025-01");
    expect(json).toEqual({
      month: "2025-01",
      measurements: [mocks.bodyPartMeasurement],
      previous: mocks.heavierBodyPartMeasurement,
      months: [mocks.bodyPartMonthSummary],
      stats: mocks.bodyPartStats,
      bodyParts: [mocks.bodyPart],
    });
  });

  test("happy path - month", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartsQuery, "execute"))
      .mockResolvedValue([mocks.bodyPart]);
    spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartMonthsQuery, "execute"))
      .mockResolvedValue([mocks.bodyPartMonthSummary]);
    spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartMeasurementsForStatsQuery, "execute"))
      .mockResolvedValue([mocks.bodyPartMeasurement]);
    const listForMonth = spies.use(
      spyOn(di.Adapters.Measurements.ListBodyPartMeasurementsForMonthQuery, "execute").mockResolvedValue({
        measurements: [mocks.heavierBodyPartMeasurement],
        previous: null,
      }),
    );

    const response = await server.request(
      url,
      { method: "QUERY", body: JSON.stringify({ month: "2024-12" }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(listForMonth).toHaveBeenCalledWith(mocks.userId, "2024-12");
    expect(json).toEqual({
      month: "2024-12",
      measurements: [mocks.heavierBodyPartMeasurement],
      previous: null,
      months: [mocks.bodyPartMonthSummary],
      stats: mocks.bodyPartStats,
      bodyParts: [mocks.bodyPart],
    });
  });

  test("happy path - all", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartsQuery, "execute"))
      .mockResolvedValue([mocks.bodyPart]);
    spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartMonthsQuery, "execute"))
      .mockResolvedValue([mocks.bodyPartMonthSummary]);
    spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartMeasurementsForStatsQuery, "execute"))
      .mockResolvedValue([mocks.bodyPartMeasurement]);
    spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartMeasurementsQuery, "execute"))
      .mockResolvedValue([mocks.bodyPartMeasurement, mocks.heavierBodyPartMeasurement]);

    const response = await server.request(
      url,
      { method: "QUERY", body: JSON.stringify({ month: "all" }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      month: "all",
      measurements: [mocks.bodyPartMeasurement, mocks.heavierBodyPartMeasurement],
      previous: null,
      months: [mocks.bodyPartMonthSummary],
      stats: mocks.bodyPartStats,
      bodyParts: [mocks.bodyPart],
    });
  });

  test("happy path - empty", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Measurements.ListBodyPartsQuery, "execute")).mockResolvedValue([]);
    spies.use(spyOn(di.Adapters.Measurements.ListBodyPartMonthsQuery, "execute")).mockResolvedValue([]);
    spies
      .use(spyOn(di.Adapters.Measurements.ListBodyPartMeasurementsForStatsQuery, "execute"))
      .mockResolvedValue([]);

    const response = await server.request(url, { method: "QUERY", body: JSON.stringify({}) }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      month: null,
      measurements: [],
      previous: null,
      months: [],
      stats: null,
      bodyParts: [],
    });
  });
});
