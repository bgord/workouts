import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Plans from "+plans";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ProgressionMethodSetsGateStrategy", () => {
  test("sets below target - hold", () => {
    const strategy = new Workouts.Services.ProgressionMethodSetsGateStrategy(
      { prescription: mocks.exercisePrescription, sets: v.parse(Plans.VO.Sets, 2) },
      {
        ProgressionMethod: new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
          { prescription: mocks.exercisePrescription, last: mocks.exercisePerformanceWeakestSet },
          { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
        ),
      },
    );

    expect(strategy.calculate()).toEqual({
      last: mocks.exerciseTargetProgression.last,
      regress: mocks.exerciseTargetProgression.regress,
      hold: Workouts.VO.ProgressionHoldReasonOptions.sets_below_target,
    });
  });

  test("sets at target - progress", () => {
    const strategy = new Workouts.Services.ProgressionMethodSetsGateStrategy(
      { prescription: mocks.exercisePrescription, sets: mocks.sets },
      {
        ProgressionMethod: new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
          { prescription: mocks.exercisePrescription, last: mocks.exercisePerformanceWeakestSet },
          { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
        ),
      },
    );

    expect(strategy.calculate()).toEqual(mocks.exerciseTargetProgression);
  });

  test("sets above target - progress", () => {
    const strategy = new Workouts.Services.ProgressionMethodSetsGateStrategy(
      { prescription: mocks.exercisePrescription, sets: mocks.anotherSets },
      {
        ProgressionMethod: new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
          { prescription: mocks.exercisePrescription, last: mocks.exercisePerformanceWeakestSet },
          { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
        ),
      },
    );

    expect(strategy.calculate()).toEqual(mocks.exerciseTargetProgression);
  });

  test("sets below target - no progress offered - no hold", () => {
    const strategy = new Workouts.Services.ProgressionMethodSetsGateStrategy(
      { prescription: mocks.exercisePrescription, sets: v.parse(Plans.VO.Sets, 2) },
      {
        ProgressionMethod: new Workouts.Services.ProgressionMethodNoneStrategy({
          last: mocks.exercisePerformanceWeakestSet,
        }),
      },
    );

    expect(strategy.calculate()).toEqual({ last: mocks.exercisePerformanceWeakestSet });
  });

  test("reps below the range - sets below target - reps hold", () => {
    const strategy = new Workouts.Services.ProgressionMethodSetsGateStrategy(
      { prescription: mocks.exercisePrescription, sets: v.parse(Plans.VO.Sets, 2) },
      {
        ProgressionMethod: new Workouts.Services.ProgressionMethodLinearProgressionStrategy(
          { prescription: mocks.exercisePrescription, last: mocks.exercisePerformanceWeakestSet },
          { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
        ),
      },
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
});
