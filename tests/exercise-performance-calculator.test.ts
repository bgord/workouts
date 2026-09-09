// cSpell:ignore epley
import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Statistics from "+statistics";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("ExercisePerformanceCalculator", async () => {
  const di = await bootstrap();

  const calculator = new Statistics.Services.ExercisePerformanceCalculator({
    OneRepEstimator: new Statistics.Services.OneRepEstimatorEpley({
      rounding: new tools.RoundingToNearestStrategy(),
    }),
    ListExercisePerformances: di.Adapters.Workouts.ListExercisePerformancesQuery,
  });

  test("happy path", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExercisePerformancesQuery, "execute").mockResolvedValue([
      mocks.exercisePerformance,
    ]);

    expect(await calculator.calculate(mocks.userId, mocks.exerciseId)).toEqual([
      {
        workoutId: mocks.workoutId,
        performedAt: mocks.T0.ms,
        sets: [
          {
            setNumber: v.parse(Workouts.VO.SetNumber, 1),
            reps: v.parse(Workouts.VO.Reps, 5),
            load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
            estimate: v.parse(Statistics.VO.OneRepMaxEstimate, 105_000),
          },
          {
            setNumber: v.parse(Workouts.VO.SetNumber, 2),
            reps: v.parse(Workouts.VO.Reps, 10),
            load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
            estimate: v.parse(Statistics.VO.OneRepMaxEstimate, 120_000),
          },
        ],
        load: v.parse(tools.WeightGrams, 1_350_000),
        bestEstimate: v.parse(Statistics.VO.OneRepMaxEstimate, 120_000),
      },
    ]);
  });

  test("no performances", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExercisePerformancesQuery, "execute").mockResolvedValue([]);

    expect(await calculator.calculate(mocks.userId, mocks.exerciseId)).toEqual([]);
  });
});
