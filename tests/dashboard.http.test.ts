import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/dashboard";

describe(`GET ${url}`, async () => {
  const di = await bootstrap();
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);

    await testcases.assertAuthResponse(response);
  });

  test("happy path", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Workouts.GetWorkoutDashboardQuery, "execute").mockResolvedValue({
        inProgress: mocks.workoutSummaryInProgress,
        nextUp: mocks.workoutSummary,
        lastCompleted: mocks.workoutSummaryCompleted,
        completed: {
          month: tools.Int.nonNegative(1),
          year: tools.Int.nonNegative(2),
          total: tools.Int.nonNegative(3),
        },
      }),
    );
    spies.use(
      spyOn(di.Adapters.Measurements.ListBodyWeightMeasurementsForStatsQuery, "execute").mockResolvedValue([
        mocks.bodyWeightMeasurement,
      ]),
    );

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      workouts: {
        inProgress: mocks.workoutSummaryInProgress,
        nextUp: mocks.workoutSummary,
        lastCompleted: mocks.workoutSummaryCompleted,
        completed: { month: 1, year: 2, total: 3 },
      },
      bodyWeightStats: mocks.bodyWeightStats,
    });
  });

  test("happy path - empty", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Workouts.GetWorkoutDashboardQuery, "execute").mockResolvedValue({
        inProgress: null,
        nextUp: null,
        lastCompleted: null,
        completed: {
          month: tools.Int.nonNegative(0),
          year: tools.Int.nonNegative(0),
          total: tools.Int.nonNegative(0),
        },
      }),
    );
    spies.use(
      spyOn(di.Adapters.Measurements.ListBodyWeightMeasurementsForStatsQuery, "execute").mockResolvedValue(
        [],
      ),
    );

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      workouts: {
        inProgress: null,
        nextUp: null,
        lastCompleted: null,
        completed: { month: 0, year: 0, total: 0 },
      },
      bodyWeightStats: null,
    });
  });
});
