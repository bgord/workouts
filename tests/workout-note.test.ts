import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Workouts from "+workouts";

describe("WorkoutNote", () => {
  test("happy path", () => {
    expect(v.safeParse(Workouts.VO.WorkoutNote, "f".repeat(500)).success).toEqual(true);
    expect(v.safeParse(Workouts.VO.WorkoutNote, "Felt heavy\nDropped to 80kg (set 3).").success).toEqual(
      true,
    );
  });

  test("rejects non-string - null", () => {
    expect(() => v.parse(Workouts.VO.WorkoutNote, null)).toThrow("workout.note.type");
  });

  test("rejects non-string - number", () => {
    expect(() => v.parse(Workouts.VO.WorkoutNote, 2024)).toThrow("workout.note.type");
  });

  test("rejects empty", () => {
    expect(() => v.parse(Workouts.VO.WorkoutNote, "")).toThrow("workout.note.invalid");
  });

  test("rejects too long", () => {
    expect(() => v.parse(Workouts.VO.WorkoutNote, "f".repeat(501))).toThrow("workout.note.invalid");
  });
});
