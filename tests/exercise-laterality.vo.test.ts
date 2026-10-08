import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Exercises from "+exercises";

describe("ExerciseLaterality", () => {
  test("happy path", () => {
    expect(v.safeParse(Exercises.VO.ExerciseLaterality, "unilateral").success).toEqual(true);
  });

  test("rejects invalid", () => {
    expect(() => v.parse(Exercises.VO.ExerciseLaterality, "invalid")).toThrow("exercise.laterality.invalid");
  });
});
