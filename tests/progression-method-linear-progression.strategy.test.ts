import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Plans from "+plans";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ProgressionMethodLinearProgressionStrategy", () => {
  test("load step either way, reps unchanged", () => {
    const strategy = new Workouts.Services.ProgressionMethodLinearProgressionStrategy(
      { prescription: mocks.linearExercisePrescription, last: mocks.exercisePerformanceWeakestSet },
      { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
    );

    expect(strategy.calculate()).toEqual({
      last: mocks.exercisePerformanceWeakestSet,
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 2),
        reps: v.parse(Workouts.VO.Reps, 5),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(87.5).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 2),
        reps: v.parse(Workouts.VO.Reps, 5),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(92.5).get()),
      }),
    });
  });

  test("load at the step - regress reaches zero", () => {
    const last = v.parse(Workouts.VO.ExerciseTarget, {
      sets: v.parse(Plans.VO.Sets, 1),
      reps: v.parse(Workouts.VO.Reps, 8),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(2.5).get()),
    });
    const strategy = new Workouts.Services.ProgressionMethodLinearProgressionStrategy(
      { prescription: mocks.linearExercisePrescription, last },
      { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
    );

    expect(strategy.calculate()).toEqual({
      last,
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 8),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 8),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(5).get()),
      }),
    });
  });

  test("load below the step - no regress", () => {
    const last = v.parse(Workouts.VO.ExerciseTarget, {
      sets: v.parse(Plans.VO.Sets, 1),
      reps: v.parse(Workouts.VO.Reps, 8),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
    });
    const strategy = new Workouts.Services.ProgressionMethodLinearProgressionStrategy(
      { prescription: mocks.linearExercisePrescription, last },
      { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
    );

    expect(strategy.calculate()).toEqual({
      last,
      regress: undefined,
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 8),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(2.5).get()),
      }),
    });
  });

  test("reps below the range - hold", () => {
    const strategy = new Workouts.Services.ProgressionMethodLinearProgressionStrategy(
      { prescription: mocks.exercisePrescription, last: mocks.exercisePerformanceWeakestSet },
      { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
    );

    expect(strategy.calculate()).toEqual({
      last: mocks.exercisePerformanceWeakestSet,
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 2),
        reps: v.parse(Workouts.VO.Reps, 5),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(87.5).get()),
      }),
      hold: Workouts.VO.ProgressionHoldReasonOptions.reps_below_target,
    });
  });

  test("locked load - last only", () => {
    const last = v.parse(Workouts.VO.ExerciseTarget, {
      sets: v.parse(Plans.VO.Sets, 1),
      reps: v.parse(Workouts.VO.Reps, 8),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
    });
    const strategy = new Workouts.Services.ProgressionMethodLinearProgressionStrategy(
      { prescription: mocks.linearExercisePrescription, last },
      { LoadStep: new Workouts.Services.LoadStepLockedStrategy() },
    );

    expect(strategy.calculate()).toEqual({ last, regress: undefined, progress: undefined });
  });

  test("locked load - reps below the range - no hold", () => {
    const strategy = new Workouts.Services.ProgressionMethodLinearProgressionStrategy(
      { prescription: mocks.exercisePrescription, last: mocks.exercisePerformanceWeakestSet },
      { LoadStep: new Workouts.Services.LoadStepLockedStrategy() },
    );

    expect(strategy.calculate()).toEqual({ last: mocks.exercisePerformanceWeakestSet });
  });
});
