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
          reps: v.parse(Workouts.VO.Reps, 10),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
          rir: null,
        },
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 2),
          reps: v.parse(Workouts.VO.Reps, 12),
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

    expect(result.bestSet.setNumber).toEqual(v.parse(Workouts.VO.SetNumber, 2));
  });
});

describe("ExercisePerformanceMetricsBodyweightStrategy.records", () => {
  test("happy path", () => {
    const strategy = new Statistics.Services.ExercisePerformanceMetricsBodyweightStrategy();
    const lowest = {
      ...mocks.calculatedRepsExercisePerformance,
      workoutId: mocks.anotherWorkoutId,
      bestSet: { ...mocks.calculatedRepsExercisePerformance.bestSet, reps: v.parse(Workouts.VO.Reps, 5) },
      totalReps: tools.Int.positive(10),
    };
    const highest = {
      ...mocks.calculatedRepsExercisePerformance,
      workoutId: mocks.anotherWorkoutId,
      scheduledFor: mocks.anotherWorkoutScheduledFor,
      bestSet: { ...mocks.calculatedRepsExercisePerformance.bestSet, reps: v.parse(Workouts.VO.Reps, 10) },
      totalReps: tools.Int.positive(30),
    };

    const result = strategy.records([lowest, mocks.calculatedRepsExercisePerformance, highest]);

    expect(result).toEqual({ peak: mocks.calculatedRepsExercisePerformance, total: highest });
  });

  test("happy path - ties go to the earliest", () => {
    const strategy = new Statistics.Services.ExercisePerformanceMetricsBodyweightStrategy();

    const result = strategy.records([
      mocks.calculatedRepsExercisePerformance,
      { ...mocks.calculatedRepsExercisePerformance, workoutId: mocks.anotherWorkoutId },
    ]);

    expect(result).toEqual({
      peak: mocks.calculatedRepsExercisePerformance,
      total: mocks.calculatedRepsExercisePerformance,
    });
  });
});
