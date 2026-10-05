import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Workouts from "+workouts";

describe("WorkoutExerciseName", () => {
  test("happy path", () => {
    expect(v.safeParse(Workouts.VO.WorkoutExerciseName, "Bench Press").success).toEqual(true);
  });

  test("rejects non-string", () => {
    expect(() => v.parse(Workouts.VO.WorkoutExerciseName, null)).toThrow("workout.exercise.name.type");
  });
});
