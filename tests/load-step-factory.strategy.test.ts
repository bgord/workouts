import { describe, expect, test } from "bun:test";
import * as Exercises from "+exercises";
import * as Workouts from "+workouts";

describe("LoadStepStrategyFactory", () => {
  test("external", () => {
    const strategy = Workouts.Services.LoadStepStrategyFactory.for(
      Exercises.VO.ExerciseLoadingOptions.external,
    );

    expect(strategy).toBeInstanceOf(Workouts.Services.LoadStepIncrementStrategy);
  });
});
