import { describe, expect, test } from "bun:test";
import * as Plans from "+plans";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ProgressionMethodStrategyFactory", () => {
  test("double_progression", () => {
    const strategy = Workouts.Services.ProgressionMethodStrategyFactory.for(
      mocks.exercisePrescription,
      mocks.workoutExerciseResistance,
      mocks.exercisePerformance,
    );

    expect(strategy).toBeInstanceOf(Workouts.Services.ProgressionMethodDoubleProgressionStrategy);
    expect(strategy.calculate()).toEqual(mocks.exerciseTargetProgression);
  });

  test("double_progression - rir below target", () => {
    const strategy = Workouts.Services.ProgressionMethodStrategyFactory.for(
      mocks.rirExercisePrescription,
      mocks.workoutExerciseResistance,
      mocks.exercisePerformanceWithRir,
    );

    expect(strategy.calculate()).toEqual({
      last: mocks.exerciseTargetProgression.last,
      regress: mocks.exerciseTargetProgression.regress,
      hold: Workouts.VO.ProgressionHoldReasonOptions.rir_below_target,
    });
  });

  test("linear_progression", () => {
    const strategy = Workouts.Services.ProgressionMethodStrategyFactory.for(
      { ...mocks.exercisePrescription, progression: Plans.VO.ProgressionMethodOptions.linear_progression },
      mocks.workoutExerciseResistance,
      mocks.exercisePerformance,
    );

    expect(strategy).toBeInstanceOf(Workouts.Services.ProgressionMethodLinearProgressionStrategy);
  });

  test("rep_progression", () => {
    const strategy = Workouts.Services.ProgressionMethodStrategyFactory.for(
      { ...mocks.exercisePrescription, progression: Plans.VO.ProgressionMethodOptions.rep_progression },
      mocks.workoutExerciseResistance,
      mocks.exercisePerformance,
    );

    expect(strategy).toBeInstanceOf(Workouts.Services.ProgressionMethodRepProgressionStrategy);
  });

  test("none", () => {
    const strategy = Workouts.Services.ProgressionMethodStrategyFactory.for(
      { ...mocks.exercisePrescription, progression: Plans.VO.ProgressionMethodOptions.none },
      mocks.workoutExerciseResistance,
      mocks.exercisePerformance,
    );

    expect(strategy).toBeInstanceOf(Workouts.Services.ProgressionMethodNoneStrategy);
  });
});
