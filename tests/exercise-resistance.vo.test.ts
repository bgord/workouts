import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Exercises from "+exercises";

describe("ExerciseResistance", () => {
  test("happy path", () => {
    expect(v.safeParse(Exercises.VO.ExerciseResistance, "weighted").success).toEqual(true);
  });

  test("rejects invalid", () => {
    expect(() => v.parse(Exercises.VO.ExerciseResistance, "invalid")).toThrow("exercise.resistance.invalid");
  });
});
