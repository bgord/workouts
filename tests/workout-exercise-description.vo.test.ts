import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Workouts from "+workouts";

describe("WorkoutExerciseDescription", () => {
  test("happy path", () => {
    expect(v.safeParse(Workouts.VO.WorkoutExerciseDescription, "Bench Press").success).toEqual(true);
  });

  test("rejects non-string", () => {
    expect(() => v.parse(Workouts.VO.WorkoutExerciseDescription, null)).toThrow(
      "workout.exercise.description.type",
    );
  });
});
