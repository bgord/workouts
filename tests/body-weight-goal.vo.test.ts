import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Measurements from "+measurements";

describe("BodyWeightGoal", () => {
  test("happy path", () => {
    expect(v.safeParse(Measurements.VO.BodyWeightGoal, "bulk").success).toEqual(true);
  });

  test("rejects invalid", () => {
    expect(() => v.parse(Measurements.VO.BodyWeightGoal, "invalid")).toThrow("body.weight.goal.invalid");
  });
});
