import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Workouts from "+workouts";

describe("Rir", () => {
  test("happy path", () => {
    expect(v.safeParse(Workouts.VO.Rir, 0).success).toEqual(true);
  });

  test("happy path - at the limit", () => {
    expect(v.safeParse(Workouts.VO.Rir, 5).success).toEqual(true);
  });

  test("rejects above the limit", () => {
    expect(() => v.parse(Workouts.VO.Rir, 6)).toThrow("rir.range");
  });
});
