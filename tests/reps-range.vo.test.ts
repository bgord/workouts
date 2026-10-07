import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Plans from "+plans";

describe("RepsRange", () => {
  test("happy path - min equal to max", () => {
    expect(v.safeParse(Plans.VO.RepsRange, { min: 5, max: 5 }).success).toEqual(true);
    expect(v.safeParse(Plans.VO.RepsRange, { min: 5, max: 10 }).success).toEqual(true);
  });

  test("happy path - no max", () => {
    expect(v.safeParse(Plans.VO.RepsRange, { min: 5 }).success).toEqual(true);
  });

  test("rejects invalid input type", () => {
    expect(() => v.parse(Plans.VO.RepsRange, null)).toThrow("reps.range.type");
    expect(() => v.parse(Plans.VO.RepsRange, "123")).toThrow("reps.range.type");
  });

  test("rejects invalid min max values", () => {
    expect(() => v.parse(Plans.VO.RepsRange, { min: 0, max: 10 })).toThrow("integer.positive.invalid");
    expect(() => v.parse(Plans.VO.RepsRange, { min: -1, max: 10 })).toThrow("integer.positive.invalid");
    expect(() => v.parse(Plans.VO.RepsRange, { min: 5, max: 0 })).toThrow("integer.positive.invalid");
    expect(() => v.parse(Plans.VO.RepsRange, { min: 1.5, max: 10 })).toThrow("integer.positive.type");
  });

  test("rejects when min is greater than max", () => {
    expect(() => v.parse(Plans.VO.RepsRange, { min: 10, max: 5 })).toThrow("reps.range.invalid");
  });
});
