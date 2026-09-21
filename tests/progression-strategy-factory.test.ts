import { describe, expect, test } from "bun:test";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ProgressionStrategyFactory", () => {
  test("double_progression", () => {
    const strategy = Workouts.Services.ProgressionStrategyFactory.for(
      mocks.exercisePrescription,
      mocks.exercisePerformance,
    );

    expect(strategy).toBeInstanceOf(Workouts.Services.DoubleProgressionCalculator);
    expect(strategy.calculate()).toEqual(mocks.exerciseTargetProgression);
  });
});
