// cSpell:ignore epley
import { describe, expect, test } from "bun:test";
import * as Exercises from "+exercises";
import * as Statistics from "+statistics";

describe("ExercisePerformanceMetricsStrategyFactory", () => {
  test("external", () => {
    const strategy = Statistics.Services.ExercisePerformanceMetricsStrategyFactory.for(
      Exercises.VO.ExerciseLoadingOptions.external,
      { OneRepEstimator: new Statistics.Services.OneRepEstimatorEpley() },
    );

    expect(strategy).toBeInstanceOf(Statistics.Services.ExercisePerformanceMetricsLoadStrategy);
  });
});
