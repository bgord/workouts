// cSpell:ignore epley
import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Statistics from "+statistics";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ExercisePerformanceMetricsWeightedStrategy", () => {
  test("happy path", () => {
    const strategy = new Statistics.Services.ExercisePerformanceMetricsWeightedStrategy({
      OneRepEstimator: new Statistics.Services.OneRepEstimatorEpley(),
    });

    const result = strategy.calculate(mocks.exercisePerformance);

    expect(result).toEqual(mocks.calculatedExercisePerformance);
  });

  test("happy path - best set is the first with the highest estimate, not the last", () => {
    const strategy = new Statistics.Services.ExercisePerformanceMetricsWeightedStrategy({
      OneRepEstimator: new Statistics.Services.OneRepEstimatorEpley(),
    });

    const result = strategy.calculate({
      ...mocks.exercisePerformance,
      sets: [
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 1),
          reps: v.parse(Workouts.VO.Reps, 1),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(100).get()),
          rir: null,
        },
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 2),
          reps: v.parse(Workouts.VO.Reps, 1),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(50).get()),
          rir: null,
        },
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 3),
          reps: v.parse(Workouts.VO.Reps, 1),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(100).get()),
          rir: null,
        },
      ],
    });

    expect(result.bestSet.setNumber).toEqual(v.parse(Workouts.VO.SetNumber, 1));
  });
});
