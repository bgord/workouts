import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";

const url = "/api/workouts/dashboard";

describe(`GET ${url}`, async () => {
  const di = await bootstrap();
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(401);
    expect(json).toEqual({ message: bg.ShieldAuthStrategyError.Rejected });
  });

  test("happy path", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Workouts.GetWorkoutDashboardQuery, "execute").mockResolvedValue({
        inProgress: { ...mocks.workoutSummary, status: Workouts.VO.WorkoutStatusEnum.in_progress },
        nextUp: mocks.workoutSummary,
        lastCompleted: {
          ...mocks.workoutSummary,
          status: Workouts.VO.WorkoutStatusEnum.completed,
          completedAt: mocks.T0.ms,
        },
        completed: {
          month: tools.Int.nonNegative(1),
          year: tools.Int.nonNegative(2),
          total: tools.Int.nonNegative(3),
        },
      }),
    );

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      inProgress: { ...mocks.workoutSummary, status: Workouts.VO.WorkoutStatusEnum.in_progress },
      nextUp: mocks.workoutSummary,
      lastCompleted: {
        ...mocks.workoutSummary,
        status: Workouts.VO.WorkoutStatusEnum.completed,
        completedAt: mocks.T0.ms,
      },
      completed: { month: 1, year: 2, total: 3 },
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

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      inProgress: null,
      nextUp: null,
      lastCompleted: null,
      completed: { month: 0, year: 0, total: 0 },
    });
  });
});
