import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Statistics from "+statistics";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ExercisePerformanceMetricsBodyweightStrategy", () => {
  test("happy path", () => {
    const strategy = new Statistics.Services.ExercisePerformanceMetricsBodyweightStrategy();

    const result = strategy.calculate(mocks.bodyweightExercisePerformance);

    expect(result).toEqual(mocks.calculatedRepsExercisePerformance);
  });

  test("happy path - best set is the first with the most reps, not the last", () => {
    const strategy = new Statistics.Services.ExercisePerformanceMetricsBodyweightStrategy();

    const result = strategy.calculate({
      ...mocks.bodyweightExercisePerformance,
      sets: [
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 1),
          reps: v.parse(Workouts.VO.Reps, 12),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
          rir: null,
        },
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 2),
          reps: v.parse(Workouts.VO.Reps, 10),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
          rir: null,
        },
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 3),
          reps: v.parse(Workouts.VO.Reps, 12),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
          rir: null,
        },
      ],
    });

    expect(result.bestSet.setNumber).toEqual(v.parse(Workouts.VO.SetNumber, 1));
  });
});
