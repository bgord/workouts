import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Exercises from "+exercises";

describe("ExerciseCategoryName", () => {
  test("happy path", () => {
    expect(v.safeParse(Exercises.VO.ExerciseCategoryName, "f".repeat(64)).success).toEqual(true);
    expect(v.safeParse(Exercises.VO.ExerciseCategoryName, "Upper Chest").success).toEqual(true);
  });

  test("rejects non-string - null", () => {
    expect(() => v.parse(Exercises.VO.ExerciseCategoryName, null)).toThrow("exercise.category.name.type");
  });

  test("rejects non-string - number", () => {
    expect(() => v.parse(Exercises.VO.ExerciseCategoryName, 2024)).toThrow("exercise.category.name.type");
  });

  test("rejects empty", () => {
    expect(() => v.parse(Exercises.VO.ExerciseCategoryName, "")).toThrow("exercise.category.name.invalid");
  });

  test("rejects too long", () => {
    expect(() => v.parse(Exercises.VO.ExerciseCategoryName, "f".repeat(65))).toThrow(
      "exercise.category.name.invalid",
    );
  });

  test("rejects too short", () => {
    expect(() => v.parse(Exercises.VO.ExerciseCategoryName, "f".repeat(2))).toThrow(
      "exercise.category.name.invalid",
    );
  });
});
