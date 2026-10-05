import { describe, expect, test } from "bun:test";
import * as Exercises from "+exercises";
import * as Workouts from "+workouts";

describe("LoadStepStrategyFactory", () => {
  test("weighted", () => {
    const strategy = Workouts.Services.LoadStepStrategyFactory.for(
      Exercises.VO.ExerciseResistanceOptions.weighted,
    );

    expect(strategy).toBeInstanceOf(Workouts.Services.LoadStepIncrementStrategy);
  });

  test("bodyweight", () => {
    const strategy = Workouts.Services.LoadStepStrategyFactory.for(
      Exercises.VO.ExerciseResistanceOptions.bodyweight,
    );

    expect(strategy).toBeInstanceOf(Workouts.Services.LoadStepLockedStrategy);
  });
});
