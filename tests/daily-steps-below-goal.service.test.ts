import { describe, expect, test } from "bun:test";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

describe("DailyStepsBelowGoal", () => {
  test("below goal", () => {
    const dailyStepsBelowGoal = new Measurements.Services.DailyStepsBelowGoal({
      goal: mocks.dailyStepsGoal,
      count: mocks.stepsCount,
    });

    expect(dailyStepsBelowGoal.calculate()).toEqual(true);
  });

  test("at goal", () => {
    const dailyStepsBelowGoal = new Measurements.Services.DailyStepsBelowGoal({
      goal: mocks.anotherDailyStepsGoal,
      count: mocks.stepsCount,
    });

    expect(dailyStepsBelowGoal.calculate()).toEqual(false);
  });

  test("above goal", () => {
    const dailyStepsBelowGoal = new Measurements.Services.DailyStepsBelowGoal({
      goal: mocks.lowDailyStepsGoal,
      count: mocks.stepsCount,
    });

    expect(dailyStepsBelowGoal.calculate()).toEqual(false);
  });

  test("no goal", () => {
    const dailyStepsBelowGoal = new Measurements.Services.DailyStepsBelowGoal({
      goal: null,
      count: mocks.stepsCount,
    });

    expect(dailyStepsBelowGoal.calculate()).toEqual(false);
  });
});
