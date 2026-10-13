import { describe, expect, spyOn, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/measurements/daily-steps/list";

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

    await testcases.assertErrorResponse(response, 400, "steps.history.month.invalid");
  });

  test("happy path", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Measurements.ListDailyStepsMonthsQuery, "execute"))
      .mockResolvedValue([mocks.stepsMonthSummary]);
    spies
      .use(spyOn(di.Adapters.Measurements.ListDailyStepsQuery, "execute"))
      .mockResolvedValue([mocks.dailySteps]);
    const listForMonth = spies
      .use(spyOn(di.Adapters.Measurements.ListDailyStepsForMonthQuery, "execute"))
      .mockResolvedValue({ entries: [mocks.dailySteps], previous: mocks.anotherDailySteps });

    const response = await server.request(url, { method: "QUERY", body: JSON.stringify({}) }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(listForMonth).toHaveBeenCalledWith(mocks.userId, "2025-01");
    expect(json).toEqual({
      month: "2025-01",
      entries: [mocks.dailySteps],
      previous: mocks.anotherDailySteps,
      months: [mocks.stepsMonthSummary],
      stats: mocks.dailyStepsStats,
    });
  });

  test("happy path - month", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Measurements.ListDailyStepsMonthsQuery, "execute"))
      .mockResolvedValue([mocks.stepsMonthSummary]);
    spies
      .use(spyOn(di.Adapters.Measurements.ListDailyStepsQuery, "execute"))
      .mockResolvedValue([mocks.dailySteps]);
    const listForMonth = spies
      .use(spyOn(di.Adapters.Measurements.ListDailyStepsForMonthQuery, "execute"))
      .mockResolvedValue({ entries: [], previous: null });

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
      entries: [],
      previous: null,
      months: [mocks.stepsMonthSummary],
      stats: mocks.dailyStepsStats,
    });
  });

  test("happy path - all", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Measurements.ListDailyStepsMonthsQuery, "execute"))
      .mockResolvedValue([mocks.stepsMonthSummary]);
    spies
      .use(spyOn(di.Adapters.Measurements.ListDailyStepsQuery, "execute"))
      .mockResolvedValue([mocks.dailySteps]);

    const response = await server.request(
      url,
      { method: "QUERY", body: JSON.stringify({ month: "all" }) },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      month: "all",
      entries: [mocks.dailySteps],
      previous: null,
      months: [mocks.stepsMonthSummary],
      stats: mocks.dailyStepsStats,
    });
  });

  test("happy path - empty", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Measurements.ListDailyStepsMonthsQuery, "execute")).mockResolvedValue([]);
    spies.use(spyOn(di.Adapters.Measurements.ListDailyStepsQuery, "execute")).mockResolvedValue([]);

    const response = await server.request(url, { method: "QUERY", body: JSON.stringify({}) }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({ month: null, entries: [], previous: null, months: [], stats: null });
  });
});
