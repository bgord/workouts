import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Measurements from "+measurements";

describe("DailyStepsGoal", () => {
  test("happy path", () => {
    expect(v.safeParse(Measurements.VO.DailyStepsGoal, 1).success).toEqual(true);
  });

  test("happy path - at the limit", () => {
    expect(v.safeParse(Measurements.VO.DailyStepsGoal, 100_000).success).toEqual(true);
  });

  test("rejects zero", () => {
    expect(() => v.parse(Measurements.VO.DailyStepsGoal, 0)).toThrow("integer.positive.invalid");
  });

  test("rejects above the limit", () => {
    expect(() => v.parse(Measurements.VO.DailyStepsGoal, 100_001)).toThrow("daily.steps.goal.range");
  });
});
