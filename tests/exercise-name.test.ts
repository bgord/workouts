import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Exercises from "+exercises";

describe("ExerciseName", () => {
  test("happy path", () => {
    expect(v.safeParse(Exercises.VO.ExerciseName, "f".repeat(64)).success).toEqual(true);
  });

  test("rejects non-string - null", () => {
    expect(() => v.parse(Exercises.VO.ExerciseName, null)).toThrow("exercise.name.type");
  });

  test("rejects non-string - number", () => {
    expect(() => v.parse(Exercises.VO.ExerciseName, 2024)).toThrow("exercise.name.type");
  });

  test("rejects empty", () => {
    expect(() => v.parse(Exercises.VO.ExerciseName, "")).toThrow("exercise.name.invalid");
  });

  test("rejects too long", () => {
    expect(() => v.parse(Exercises.VO.ExerciseName, "f".repeat(65))).toThrow("exercise.name.invalid");
  });

  test("rejects too short", () => {
    expect(() => v.parse(Exercises.VO.ExerciseName, "f".repeat(2))).toThrow("exercise.name.invalid");
  });
});
