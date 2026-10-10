import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Plans from "+plans";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ProgressionMethodAdvisorStrategy", () => {
  test("no signal - progress", () => {
    const strategy = new Workouts.Services.ProgressionMethodAdvisorStrategy({
      ProgressionMethod: new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
        { prescription: mocks.rirExercisePrescription, last: mocks.exercisePerformanceWeakestSet },
        { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
      ),
      ProgressionSignals: [
        new Workouts.Services.ProgressionSignalSetsBelowTargetStrategy({
          prescription: mocks.rirExercisePrescription,
          sets: mocks.sets,
        }),
        new Workouts.Services.ProgressionSignalRirBelowTargetStrategy({
          prescription: mocks.rirExercisePrescription,
          rir: v.parse(Workouts.VO.Rir, 2),
        }),
      ],
    });

    expect(strategy.calculate()).toEqual(mocks.exerciseTargetProgression);
  });

  test("signal - hold", () => {
    const strategy = new Workouts.Services.ProgressionMethodAdvisorStrategy({
      ProgressionMethod: new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
        { prescription: mocks.rirExercisePrescription, last: mocks.exercisePerformanceWeakestSet },
        { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
      ),
      ProgressionSignals: [
        new Workouts.Services.ProgressionSignalSetsBelowTargetStrategy({
          prescription: mocks.rirExercisePrescription,
          sets: mocks.sets,
        }),
        new Workouts.Services.ProgressionSignalRirBelowTargetStrategy({
          prescription: mocks.rirExercisePrescription,
          rir: v.parse(Workouts.VO.Rir, 1),
        }),
      ],
    });

    expect(strategy.calculate()).toEqual({
      last: mocks.exerciseTargetProgression.last,
      regress: mocks.exerciseTargetProgression.regress,
      hold: Workouts.VO.ProgressionHoldReasonOptions.rir_below_target,
    });
  });

  test("signals - first signal hold", () => {
    const strategy = new Workouts.Services.ProgressionMethodAdvisorStrategy({
      ProgressionMethod: new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
        { prescription: mocks.rirExercisePrescription, last: mocks.exercisePerformanceWeakestSet },
        { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
      ),
      ProgressionSignals: [
        new Workouts.Services.ProgressionSignalSetsBelowTargetStrategy({
          prescription: mocks.rirExercisePrescription,
          sets: v.parse(Plans.VO.Sets, 2),
        }),
        new Workouts.Services.ProgressionSignalRirBelowTargetStrategy({
          prescription: mocks.rirExercisePrescription,
          rir: v.parse(Workouts.VO.Rir, 1),
        }),
      ],
    });

    expect(strategy.calculate()).toEqual({
      last: mocks.exerciseTargetProgression.last,
      regress: mocks.exerciseTargetProgression.regress,
      hold: Workouts.VO.ProgressionHoldReasonOptions.sets_below_target,
    });
  });

  test("signal - no progress offered - no hold", () => {
    const strategy = new Workouts.Services.ProgressionMethodAdvisorStrategy({
      ProgressionMethod: new Workouts.Services.ProgressionMethodNoneStrategy({
        last: mocks.exercisePerformanceWeakestSet,
      }),
      ProgressionSignals: [
        new Workouts.Services.ProgressionSignalSetsBelowTargetStrategy({
          prescription: mocks.rirExercisePrescription,
          sets: v.parse(Plans.VO.Sets, 2),
        }),
      ],
    });

    expect(strategy.calculate()).toEqual({ last: mocks.exercisePerformanceWeakestSet });
  });

  test("reps below the range - signal - reps hold", () => {
    const strategy = new Workouts.Services.ProgressionMethodAdvisorStrategy({
      ProgressionMethod: new Workouts.Services.ProgressionMethodLinearProgressionStrategy(
        { prescription: mocks.rirExercisePrescription, last: mocks.exercisePerformanceWeakestSet },
        { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
      ),
      ProgressionSignals: [
        new Workouts.Services.ProgressionSignalSetsBelowTargetStrategy({
          prescription: mocks.rirExercisePrescription,
          sets: v.parse(Plans.VO.Sets, 2),
        }),
      ],
    });

    expect(strategy.calculate()).toEqual({
      last: mocks.exercisePerformanceWeakestSet,
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 2),
        reps: v.parse(Workouts.VO.Reps, 8),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(87.5).get()),
      }),
      hold: Workouts.VO.ProgressionHoldReasonOptions.reps_below_target,
    });
  });
});
