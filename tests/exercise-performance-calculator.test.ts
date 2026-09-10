// cSpell:ignore epley
import { describe, expect, spyOn, test } from "bun:test";
import * as Statistics from "+statistics";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("ExercisePerformanceCalculator", async () => {
  const di = await bootstrap();

  const calculator = new Statistics.Services.ExercisePerformanceCalculator({
    OneRepEstimator: new Statistics.Services.OneRepEstimatorEpley(),
    ListExercisePerformances: di.Adapters.Workouts.ListExercisePerformancesQuery,
  });

  test("happy path", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExercisePerformancesQuery, "execute").mockResolvedValue([
      mocks.exercisePerformance,
    ]);

    expect(await calculator.calculate(mocks.userId, mocks.exerciseId)).toEqual([
      mocks.calculatedExercisePerformance,
    ]);
  });

  test("no performances", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExercisePerformancesQuery, "execute").mockResolvedValue([]);

    expect(await calculator.calculate(mocks.userId, mocks.exerciseId)).toEqual([]);
  });
});
