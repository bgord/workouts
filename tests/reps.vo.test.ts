import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Plans from "+plans";

describe("Reps", () => {
  test("happy path - min equal to max", () => {
    expect(v.safeParse(Plans.VO.Reps, { min: 5, max: 5 }).success).toEqual(true);
    expect(v.safeParse(Plans.VO.Reps, { min: 5, max: 10 }).success).toEqual(true);
  });

  test("rejects invalid input type", () => {
    expect(() => v.parse(Plans.VO.Reps, null)).toThrow("reps.type");
    expect(() => v.parse(Plans.VO.Reps, "123")).toThrow("reps.type");
  });

  test("rejects invalid min max values", () => {
    expect(() => v.parse(Plans.VO.Reps, { min: 0, max: 10 })).toThrow("integer.positive.invalid");
    expect(() => v.parse(Plans.VO.Reps, { min: -1, max: 10 })).toThrow("integer.positive.invalid");
    expect(() => v.parse(Plans.VO.Reps, { min: 5, max: 0 })).toThrow("integer.positive.invalid");
    expect(() => v.parse(Plans.VO.Reps, { min: 1.5, max: 10 })).toThrow("integer.positive.type");
  });

  test("rejects when min is greater than max", () => {
    expect(() => v.parse(Plans.VO.Reps, { min: 10, max: 5 })).toThrow("reps.range");
  });
});
