import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Plans from "+plans";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ProgressionMethodStrategyFactory", () => {
  test("double_progression", () => {
    const strategy = Workouts.Services.ProgressionMethodStrategyFactory.for(
      { ...mocks.exercisePrescription, sets: v.parse(Plans.VO.Sets, 2) },
      mocks.exerciseLoadStep,
      mocks.exercisePerformance,
      mocks.exerciseRecentPerformances,
    );

    expect(strategy).toBeInstanceOf(Workouts.Services.ProgressionMethodAdvisorStrategy);
    expect(strategy["deps"].ProgressionMethod).toBeInstanceOf(
      Workouts.Services.ProgressionMethodDoubleProgressionStrategy,
    );
    expect(strategy["deps"].ProgressionSignals[0]).toBeInstanceOf(
      Workouts.Services.ProgressionSignalStallStrategy,
    );
    expect(strategy["deps"].ProgressionSignals[1]).toBeInstanceOf(
      Workouts.Services.ProgressionSignalRepsBelowTargetStrategy,
    );
    expect(strategy["deps"].ProgressionSignals[2]).toBeInstanceOf(
      Workouts.Services.ProgressionSignalSetsBelowTargetStrategy,
    );
    expect(strategy["deps"].ProgressionSignals[3]).toBeInstanceOf(
      Workouts.Services.ProgressionSignalRirBelowTargetStrategy,
    );
    expect(strategy.calculate()).toEqual({
      last: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 2),
        reps: v.parse(Workouts.VO.Reps, 5),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
      }),
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 2),
        reps: v.parse(Workouts.VO.Reps, 12),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(87.5).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 2),
        reps: v.parse(Workouts.VO.Reps, 6),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
      }),
    });
  });

  test("double_progression - stall", () => {
    const strategy = Workouts.Services.ProgressionMethodStrategyFactory.for(
      { ...mocks.exercisePrescription, sets: v.parse(Plans.VO.Sets, 2) },
      mocks.exerciseLoadStep,
      mocks.exercisePerformance,
      mocks.stalledExerciseRecentPerformances,
    );

    expect(strategy.calculate()).toEqual({
      last: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 2),
        reps: v.parse(Workouts.VO.Reps, 5),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
      }),
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 2),
        reps: v.parse(Workouts.VO.Reps, 12),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(87.5).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 2),
        reps: v.parse(Workouts.VO.Reps, 6),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
      }),
      signal: Workouts.VO.ProgressionSignalOptions.stall,
    });
  });

  test("double_progression - rir below target", () => {
    const strategy = Workouts.Services.ProgressionMethodStrategyFactory.for(
      { ...mocks.rirExercisePrescription, sets: v.parse(Plans.VO.Sets, 2) },
      mocks.exerciseLoadStep,
      mocks.exercisePerformanceWithRir,
      mocks.exerciseRecentPerformances,
    );

    expect(strategy.calculate()).toEqual({
      last: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 2),
        reps: v.parse(Workouts.VO.Reps, 5),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
      }),
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 2),
        reps: v.parse(Workouts.VO.Reps, 12),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(87.5).get()),
      }),
      signal: Workouts.VO.ProgressionSignalOptions.rir_below_target,
    });
  });

  test("double_progression - rir below target - set without rir", () => {
    const strategy = Workouts.Services.ProgressionMethodStrategyFactory.for(
      { ...mocks.rirExercisePrescription, sets: v.parse(Plans.VO.Sets, 2) },
      mocks.exerciseLoadStep,
      mocks.exercisePerformanceWithPartialRir,
      mocks.exerciseRecentPerformances,
    );

    expect(strategy.calculate()).toEqual({
      last: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 2),
        reps: v.parse(Workouts.VO.Reps, 5),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
      }),
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 2),
        reps: v.parse(Workouts.VO.Reps, 12),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(87.5).get()),
      }),
      signal: Workouts.VO.ProgressionSignalOptions.rir_below_target,
    });
  });

  test("double_progression - sets below target", () => {
    const strategy = Workouts.Services.ProgressionMethodStrategyFactory.for(
      mocks.exercisePrescription,
      mocks.exerciseLoadStep,
      mocks.exercisePerformance,
      mocks.exerciseRecentPerformances,
    );

    expect(strategy.calculate()).toEqual({
      last: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 3),
        reps: v.parse(Workouts.VO.Reps, 5),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
      }),
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 3),
        reps: v.parse(Workouts.VO.Reps, 12),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(87.5).get()),
      }),
      signal: Workouts.VO.ProgressionSignalOptions.sets_below_target,
    });
  });

  test("double_progression - sets and rir below target - sets hold", () => {
    const strategy = Workouts.Services.ProgressionMethodStrategyFactory.for(
      mocks.rirExercisePrescription,
      mocks.exerciseLoadStep,
      mocks.exercisePerformanceWithRir,
      mocks.exerciseRecentPerformances,
    );

    expect(strategy.calculate()).toEqual({
      last: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 3),
        reps: v.parse(Workouts.VO.Reps, 5),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
      }),
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 3),
        reps: v.parse(Workouts.VO.Reps, 12),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(87.5).get()),
      }),
      signal: Workouts.VO.ProgressionSignalOptions.sets_below_target,
    });
  });

  test("linear_progression", () => {
    const strategy = Workouts.Services.ProgressionMethodStrategyFactory.for(
      { ...mocks.exercisePrescription, progression: Plans.VO.ProgressionMethodOptions.linear_progression },
      mocks.exerciseLoadStep,
      mocks.exercisePerformance,
      mocks.exerciseRecentPerformances,
    );

    expect(strategy).toBeInstanceOf(Workouts.Services.ProgressionMethodAdvisorStrategy);
    expect(strategy["deps"].ProgressionMethod).toBeInstanceOf(
      Workouts.Services.ProgressionMethodLinearProgressionStrategy,
    );
    expect(strategy["deps"].ProgressionSignals[0]).toBeInstanceOf(
      Workouts.Services.ProgressionSignalStallStrategy,
    );
    expect(strategy["deps"].ProgressionSignals[1]).toBeInstanceOf(
      Workouts.Services.ProgressionSignalRepsBelowTargetStrategy,
    );
    expect(strategy["deps"].ProgressionSignals[2]).toBeInstanceOf(
      Workouts.Services.ProgressionSignalSetsBelowTargetStrategy,
    );
    expect(strategy["deps"].ProgressionSignals[3]).toBeInstanceOf(
      Workouts.Services.ProgressionSignalRirBelowTargetStrategy,
    );
  });

  test("linear_progression - reps below target", () => {
    const strategy = Workouts.Services.ProgressionMethodStrategyFactory.for(
      {
        ...mocks.exercisePrescription,
        sets: v.parse(Plans.VO.Sets, 2),
        progression: Plans.VO.ProgressionMethodOptions.linear_progression,
      },
      mocks.exerciseLoadStep,
      mocks.exercisePerformance,
      mocks.exerciseRecentPerformances,
    );

    expect(strategy.calculate()).toEqual({
      last: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 2),
        reps: v.parse(Workouts.VO.Reps, 5),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
      }),
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 2),
        reps: v.parse(Workouts.VO.Reps, 8),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(87.5).get()),
      }),
      signal: Workouts.VO.ProgressionSignalOptions.reps_below_target,
    });
  });

  test("rep_progression", () => {
    const strategy = Workouts.Services.ProgressionMethodStrategyFactory.for(
      { ...mocks.exercisePrescription, progression: Plans.VO.ProgressionMethodOptions.rep_progression },
      mocks.exerciseLoadStep,
      mocks.exercisePerformance,
      mocks.exerciseRecentPerformances,
    );

    expect(strategy).toBeInstanceOf(Workouts.Services.ProgressionMethodAdvisorStrategy);
    expect(strategy["deps"].ProgressionMethod).toBeInstanceOf(
      Workouts.Services.ProgressionMethodRepProgressionStrategy,
    );
    expect(strategy["deps"].ProgressionSignals[0]).toBeInstanceOf(
      Workouts.Services.ProgressionSignalStallStrategy,
    );
    expect(strategy["deps"].ProgressionSignals[1]).toBeInstanceOf(
      Workouts.Services.ProgressionSignalRepsBelowTargetStrategy,
    );
    expect(strategy["deps"].ProgressionSignals[2]).toBeInstanceOf(
      Workouts.Services.ProgressionSignalSetsBelowTargetStrategy,
    );
    expect(strategy["deps"].ProgressionSignals[3]).toBeInstanceOf(
      Workouts.Services.ProgressionSignalRirBelowTargetStrategy,
    );
  });

  test("none", () => {
    const strategy = Workouts.Services.ProgressionMethodStrategyFactory.for(
      { ...mocks.exercisePrescription, progression: Plans.VO.ProgressionMethodOptions.none },
      mocks.exerciseLoadStep,
      mocks.exercisePerformance,
      mocks.exerciseRecentPerformances,
    );

    expect(strategy).toBeInstanceOf(Workouts.Services.ProgressionMethodAdvisorStrategy);
    expect(strategy["deps"].ProgressionMethod).toBeInstanceOf(
      Workouts.Services.ProgressionMethodNoneStrategy,
    );
    expect(strategy["deps"].ProgressionSignals[0]).toBeInstanceOf(
      Workouts.Services.ProgressionSignalStallStrategy,
    );
    expect(strategy["deps"].ProgressionSignals[1]).toBeInstanceOf(
      Workouts.Services.ProgressionSignalRepsBelowTargetStrategy,
    );
    expect(strategy["deps"].ProgressionSignals[2]).toBeInstanceOf(
      Workouts.Services.ProgressionSignalSetsBelowTargetStrategy,
    );
    expect(strategy["deps"].ProgressionSignals[3]).toBeInstanceOf(
      Workouts.Services.ProgressionSignalRirBelowTargetStrategy,
    );
  });
});
