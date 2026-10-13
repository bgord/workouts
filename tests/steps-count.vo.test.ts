import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Measurements from "+measurements";

describe("StepsCount", () => {
  test("happy path", () => {
    expect(v.safeParse(Measurements.VO.StepsCount, 0).success).toEqual(true);
  });

  test("happy path - at the limit", () => {
    expect(v.safeParse(Measurements.VO.StepsCount, 100_000).success).toEqual(true);
  });

  test("rejects above the limit", () => {
    expect(() => v.parse(Measurements.VO.StepsCount, 100_001)).toThrow("steps.count.range");
  });
});
