import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";

const url = `/api/statistics/exercises/${mocks.exerciseId}/performances`;

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
      spyOn(di.Adapters.Workouts.ListExercisePerformancesQuery, "execute").mockResolvedValue([
        mocks.exercisePerformance,
      ]),
    );

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({
      performances: [
        {
          workoutId: mocks.workoutId,
          performedAt: mocks.T0.ms,
          sets: [
            { setNumber: 1, reps: 5, load: 90_000, estimate: 105_000 },
            { setNumber: 2, reps: 10, load: 90_000, estimate: 120_000 },
          ],
          load: 1_350_000,
          bestEstimate: 120_000,
        },
      ],
    });
  });

  test("happy path - no performances", async () => {
    const spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Workouts.ListExercisePerformancesQuery, "execute").mockResolvedValue([]));

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(200);
    expect(json).toEqual({ performances: [] });
  });
});
