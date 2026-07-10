import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Exercises from "+exercises";

describe("ExerciseDescription", () => {
  test("happy path", () => {
    expect(v.safeParse(Exercises.VO.ExerciseDescription, "f".repeat(256)).success).toEqual(true);
    expect(
      v.safeParse(
        Exercises.VO.ExerciseDescription,
        "Press the barbell upwards, while lying on the horizontal bench.",
      ).success,
    ).toEqual(true);
  });

  test("rejects non-string - null", () => {
    expect(() => v.parse(Exercises.VO.ExerciseDescription, null)).toThrow("exercise.description.type");
  });

  test("rejects non-string - number", () => {
    expect(() => v.parse(Exercises.VO.ExerciseDescription, 2024)).toThrow("exercise.description.type");
  });

  test("rejects empty", () => {
    expect(() => v.parse(Exercises.VO.ExerciseDescription, "")).toThrow("exercise.description.invalid");
  });

  test("rejects too long", () => {
    expect(() => v.parse(Exercises.VO.ExerciseDescription, "f".repeat(257))).toThrow(
      "exercise.description.invalid",
    );
  });

  test("rejects too short", () => {
    expect(() => v.parse(Exercises.VO.ExerciseDescription, "f".repeat(2))).toThrow(
      "exercise.description.invalid",
    );
  });
});
