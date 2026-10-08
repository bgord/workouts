import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Plans from "+plans";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ProgressionMethodStrategyFactory", () => {
  test("double_progression", () => {
    const strategy = Workouts.Services.ProgressionMethodStrategyFactory.for(
      mocks.exercisePrescription,
      mocks.exerciseLoadStep,
      mocks.exercisePerformance,
    );

    expect(strategy).toBeInstanceOf(Workouts.Services.ProgressionMethodEffortGateStrategy);
    expect(strategy["deps"].ProgressionMethod).toBeInstanceOf(
      Workouts.Services.ProgressionMethodDoubleProgressionStrategy,
    );
    expect(strategy.calculate()).toEqual({
      last: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 3),
        reps: v.parse(Workouts.VO.Reps, 5),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
      }),
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 3),
        reps: v.parse(Workouts.VO.Reps, 4),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 3),
        reps: v.parse(Workouts.VO.Reps, 6),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
      }),
    });
  });

  test("double_progression - rir below target", () => {
    const strategy = Workouts.Services.ProgressionMethodStrategyFactory.for(
      mocks.rirExercisePrescription,
      mocks.exerciseLoadStep,
      mocks.exercisePerformanceWithRir,
    );

    expect(strategy.calculate()).toEqual({
      last: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 3),
        reps: v.parse(Workouts.VO.Reps, 5),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
      }),
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 3),
        reps: v.parse(Workouts.VO.Reps, 4),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
      }),
      hold: Workouts.VO.ProgressionHoldReasonOptions.rir_below_target,
    });
  });

  test("linear_progression", () => {
    const strategy = Workouts.Services.ProgressionMethodStrategyFactory.for(
      { ...mocks.exercisePrescription, progression: Plans.VO.ProgressionMethodOptions.linear_progression },
      mocks.exerciseLoadStep,
      mocks.exercisePerformance,
    );

    expect(strategy).toBeInstanceOf(Workouts.Services.ProgressionMethodEffortGateStrategy);
    expect(strategy["deps"].ProgressionMethod).toBeInstanceOf(
      Workouts.Services.ProgressionMethodLinearProgressionStrategy,
    );
  });

  test("rep_progression", () => {
    const strategy = Workouts.Services.ProgressionMethodStrategyFactory.for(
      { ...mocks.exercisePrescription, progression: Plans.VO.ProgressionMethodOptions.rep_progression },
      mocks.exerciseLoadStep,
      mocks.exercisePerformance,
    );

    expect(strategy).toBeInstanceOf(Workouts.Services.ProgressionMethodEffortGateStrategy);
    expect(strategy["deps"].ProgressionMethod).toBeInstanceOf(
      Workouts.Services.ProgressionMethodRepProgressionStrategy,
    );
  });

  test("none", () => {
    const strategy = Workouts.Services.ProgressionMethodStrategyFactory.for(
      { ...mocks.exercisePrescription, progression: Plans.VO.ProgressionMethodOptions.none },
      mocks.exerciseLoadStep,
      mocks.exercisePerformance,
    );

    expect(strategy).toBeInstanceOf(Workouts.Services.ProgressionMethodEffortGateStrategy);
    expect(strategy["deps"].ProgressionMethod).toBeInstanceOf(
      Workouts.Services.ProgressionMethodNoneStrategy,
    );
  });
});
