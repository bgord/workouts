import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Plans from "+plans";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ProgressionMethodEffortGateStrategy", () => {
  test("rir below target - hold", () => {
    const strategy = new Workouts.Services.ProgressionMethodEffortGateStrategy(
      { prescription: mocks.rirExercisePrescription, effort: v.parse(Workouts.VO.Rir, 1) },
      {
        ProgressionMethod: new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
          { prescription: mocks.rirExercisePrescription, last: mocks.exercisePerformanceWeakestSet },
          { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
        ),
      },
    );

    expect(strategy.calculate()).toEqual({
      last: mocks.exerciseTargetProgression.last,
      regress: mocks.exerciseTargetProgression.regress,
      hold: Workouts.VO.ProgressionHoldReasonOptions.rir_below_target,
    });
  });

  test("rir at target - progress", () => {
    const strategy = new Workouts.Services.ProgressionMethodEffortGateStrategy(
      { prescription: mocks.rirExercisePrescription, effort: v.parse(Workouts.VO.Rir, 2) },
      {
        ProgressionMethod: new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
          { prescription: mocks.rirExercisePrescription, last: mocks.exercisePerformanceWeakestSet },
          { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
        ),
      },
    );

    expect(strategy.calculate()).toEqual(mocks.exerciseTargetProgression);
  });

  test("effort unknown - progress", () => {
    const strategy = new Workouts.Services.ProgressionMethodEffortGateStrategy(
      { prescription: mocks.rirExercisePrescription, effort: undefined },
      {
        ProgressionMethod: new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
          { prescription: mocks.rirExercisePrescription, last: mocks.exercisePerformanceWeakestSet },
          { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
        ),
      },
    );

    expect(strategy.calculate()).toEqual(mocks.exerciseTargetProgression);
  });

  test("no rir target - progress", () => {
    const strategy = new Workouts.Services.ProgressionMethodEffortGateStrategy(
      { prescription: mocks.exercisePrescription, effort: v.parse(Workouts.VO.Rir, 0) },
      {
        ProgressionMethod: new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
          { prescription: mocks.exercisePrescription, last: mocks.exercisePerformanceWeakestSet },
          { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
        ),
      },
    );

    expect(strategy.calculate()).toEqual(mocks.exerciseTargetProgression);
  });

  test("rir below target - no progress offered - no hold", () => {
    const strategy = new Workouts.Services.ProgressionMethodEffortGateStrategy(
      { prescription: mocks.rirExercisePrescription, effort: v.parse(Workouts.VO.Rir, 1) },
      {
        ProgressionMethod: new Workouts.Services.ProgressionMethodNoneStrategy({
          last: mocks.exercisePerformanceWeakestSet,
        }),
      },
    );

    expect(strategy.calculate()).toEqual({ last: mocks.exercisePerformanceWeakestSet });
  });

  test("reps below the range - rir below target - reps hold", () => {
    const strategy = new Workouts.Services.ProgressionMethodEffortGateStrategy(
      { prescription: mocks.rirExercisePrescription, effort: v.parse(Workouts.VO.Rir, 1) },
      {
        ProgressionMethod: new Workouts.Services.ProgressionMethodLinearProgressionStrategy(
          { prescription: mocks.rirExercisePrescription, last: mocks.exercisePerformanceWeakestSet },
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
