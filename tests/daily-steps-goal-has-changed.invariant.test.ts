import { describe, expect, test } from "bun:test";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

describe("DailyStepsGoalHasChanged", () => {
  test("passes - no goal", () => {
    const config = { current: null, goal: mocks.dailyStepsGoal };

    expect(Measurements.Invariants.DailyStepsGoalHasChanged.passes(config)).toEqual(true);
  });

  test("passes - goal changed", () => {
    const config = { current: mocks.stepsCount, goal: mocks.dailyStepsGoal };

    expect(Measurements.Invariants.DailyStepsGoalHasChanged.passes(config)).toEqual(true);
  });

  test("fails - goal unchanged", () => {
    const config = { current: mocks.dailyStepsGoal, goal: mocks.dailyStepsGoal };

    expect(Measurements.Invariants.DailyStepsGoalHasChanged.passes(config)).toEqual(false);
  });

  test("enforce - throws", () => {
    const config = { current: mocks.dailyStepsGoal, goal: mocks.dailyStepsGoal };

    expect(() => Measurements.Invariants.DailyStepsGoalHasChanged.enforce(config)).toThrow(
      Measurements.Invariants.DailyStepsGoalHasChanged.error,
    );
  });
});
