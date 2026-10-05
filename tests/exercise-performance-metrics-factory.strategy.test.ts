// cSpell:ignore epley
import { describe, expect, test } from "bun:test";
import * as Exercises from "+exercises";
import * as Statistics from "+statistics";

describe("ExercisePerformanceMetricsStrategyFactory", () => {
  test("weighted", () => {
    const strategy = Statistics.Services.ExercisePerformanceMetricsStrategyFactory.for(
      Exercises.VO.ExerciseResistanceOptions.weighted,
      { OneRepEstimator: new Statistics.Services.OneRepEstimatorEpley() },
    );

    expect(strategy).toBeInstanceOf(Statistics.Services.ExercisePerformanceMetricsLoadStrategy);
  });

  test("bodyweight", () => {
    const strategy = Statistics.Services.ExercisePerformanceMetricsStrategyFactory.for(
      Exercises.VO.ExerciseResistanceOptions.bodyweight,
      { OneRepEstimator: new Statistics.Services.OneRepEstimatorEpley() },
    );

    expect(strategy).toBeInstanceOf(Statistics.Services.ExercisePerformanceMetricsRepsStrategy);
  });
});
