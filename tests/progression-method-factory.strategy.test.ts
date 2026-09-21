import { describe, expect, test } from "bun:test";
import * as Plans from "+plans";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ProgressionMethodStrategyFactory", () => {
  test("double_progression", () => {
    const strategy = Workouts.Services.ProgressionMethodStrategyFactory.for(
      mocks.exercisePrescription,
      mocks.exercisePerformance,
    );

    expect(strategy).toBeInstanceOf(Workouts.Services.ProgressionMethodDoubleProgressionStrategy);
    expect(strategy.calculate()).toEqual(mocks.exerciseTargetProgression);
  });

  test("linear_progression", () => {
    const strategy = Workouts.Services.ProgressionMethodStrategyFactory.for(
      { ...mocks.exercisePrescription, progression: Plans.VO.ProgressionMethodOptions.linear_progression },
      mocks.exercisePerformance,
    );

    expect(strategy).toBeInstanceOf(Workouts.Services.ProgressionMethodLinearProgressionStrategy);
  });
});
