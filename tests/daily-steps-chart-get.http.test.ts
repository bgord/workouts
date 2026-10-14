import { describe, expect, spyOn, test } from "bun:test";
import * as Measurements from "+measurements";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/measurements/daily-steps/chart";

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

    await testcases.assertErrorResponse(response, 400, "daily.steps.chart.granularity.invalid");
  });

  test("happy path", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Measurements.ListDailyStepsQuery, "execute"))
      .mockResolvedValue([mocks.dailySteps, mocks.anotherDailySteps]);

    const response = await server.request(
      url,
      {
        method: "QUERY",
        body: JSON.stringify({ granularity: Measurements.VO.DailyStepsChartGranularityOptions.weekly }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      points: [{ from: mocks.anotherDailyStepsDay, to: mocks.dailyStepsDay, steps: 7_000, count: 2 }],
    });
  });

  test("happy path - daily", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies
      .use(spyOn(di.Adapters.Measurements.ListDailyStepsQuery, "execute"))
      .mockResolvedValue([mocks.dailySteps]);

    const response = await server.request(
      url,
      {
        method: "QUERY",
        body: JSON.stringify({ granularity: Measurements.VO.DailyStepsChartGranularityOptions.daily }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      points: [{ from: mocks.dailyStepsDay, to: mocks.dailyStepsDay, steps: 8_000, count: 1 }],
    });
  });

  test("happy path - empty", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Measurements.ListDailyStepsQuery, "execute")).mockResolvedValue([]);

    const response = await server.request(
      url,
      {
        method: "QUERY",
        body: JSON.stringify({ granularity: Measurements.VO.DailyStepsChartGranularityOptions.weekly }),
      },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({ points: [] });
  });
});
