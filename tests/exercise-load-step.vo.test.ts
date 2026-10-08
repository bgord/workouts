import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Exercises from "+exercises";

describe("ExerciseLoadStep", () => {
  test("happy path", () => {
    expect(v.safeParse(Exercises.VO.ExerciseLoadStep, "dumbbell_rack").success).toEqual(true);
  });

  test("rejects invalid", () => {
    expect(() => v.parse(Exercises.VO.ExerciseLoadStep, "invalid")).toThrow("exercise.load.step.invalid");
  });
});
