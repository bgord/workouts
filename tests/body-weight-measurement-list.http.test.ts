import { describe, expect, spyOn, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/measurements/body-weight/list";

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

    await testcases.assertErrorResponse(response, 400, "body.weight.history.month.invalid");
  });

  test("happy path", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Measurements.ListBodyWeightMonthsQuery, "execute").mockResolvedValue([
        mocks.bodyWeightMonthSummary,
      ]),
    );
    spies.use(
      spyOn(di.Adapters.Measurements.ListBodyWeightMeasurementsForStatsQuery, "execute").mockResolvedValue([
        mocks.bodyWeightMeasurement,
      ]),
    );
    const listForMonth = spies.use(
      spyOn(di.Adapters.Measurements.ListBodyWeightMeasurementsForMonthQuery, "execute").mockResolvedValue({
        measurements: [mocks.bodyWeightMeasurement],
        previous: mocks.heavierBodyWeightMeasurement,
      }),
    );

    const response = await server.request(url, { method: "QUERY", body: JSON.stringify({}) }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(listForMonth).toHaveBeenCalledWith(mocks.userId, "2025-01");
    expect(json).toEqual({
      month: "2025-01",
      measurements: [mocks.bodyWeightMeasurement],
      previous: mocks.heavierBodyWeightMeasurement,
      months: [mocks.bodyWeightMonthSummary],
      stats: mocks.bodyWeightStats,
    });
  });

  test("happy path - month", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Measurements.ListBodyWeightMonthsQuery, "execute").mockResolvedValue([
        mocks.bodyWeightMonthSummary,
      ]),
    );
    spies.use(
      spyOn(di.Adapters.Measurements.ListBodyWeightMeasurementsForStatsQuery, "execute").mockResolvedValue([
        mocks.bodyWeightMeasurement,
      ]),
    );
    const listForMonth = spies.use(
      spyOn(di.Adapters.Measurements.ListBodyWeightMeasurementsForMonthQuery, "execute").mockResolvedValue({
        measurements: [mocks.heavierBodyWeightMeasurement],
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
      measurements: [mocks.heavierBodyWeightMeasurement],
      previous: null,
      months: [mocks.bodyWeightMonthSummary],
      stats: mocks.bodyWeightStats,
    });
  });

  test("happy path - all", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Measurements.ListBodyWeightMonthsQuery, "execute").mockResolvedValue([
        mocks.bodyWeightMonthSummary,
      ]),
    );
    spies.use(
      spyOn(di.Adapters.Measurements.ListBodyWeightMeasurementsForStatsQuery, "execute").mockResolvedValue([
        mocks.bodyWeightMeasurement,
      ]),
    );
    spies.use(
      spyOn(di.Adapters.Measurements.ListBodyWeightMeasurementsQuery, "execute").mockResolvedValue([
        mocks.bodyWeightMeasurement,
        mocks.heavierBodyWeightMeasurement,
      ]),
    );

    const response = await server.request(
      url,
      { method: "QUERY", body: JSON.stringify({ month: "all" }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      month: "all",
      measurements: [mocks.bodyWeightMeasurement, mocks.heavierBodyWeightMeasurement],
      previous: null,
      months: [mocks.bodyWeightMonthSummary],
      stats: mocks.bodyWeightStats,
    });
  });

  test("happy path - empty", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Measurements.ListBodyWeightMonthsQuery, "execute").mockResolvedValue([]));
    spies.use(
      spyOn(di.Adapters.Measurements.ListBodyWeightMeasurementsForStatsQuery, "execute").mockResolvedValue(
        [],
      ),
    );

    const response = await server.request(url, { method: "QUERY", body: JSON.stringify({}) }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({ month: null, measurements: [], previous: null, months: [], stats: null });
  });
});
