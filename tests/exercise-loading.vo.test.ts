import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Exercises from "+exercises";

describe("ExerciseLoading", () => {
  test("happy path", () => {
    expect(v.safeParse(Exercises.VO.ExerciseLoading, "external").success).toEqual(true);
  });

  test("rejects invalid", () => {
    expect(() => v.parse(Exercises.VO.ExerciseLoading, "invalid")).toThrow("exercise.loading.invalid");
  });
});
