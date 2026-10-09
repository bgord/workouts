import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Exercises from "+exercises";
import * as Workouts from "+workouts";

describe("WorkoutExerciseLaterality", () => {
  test("happy path", () => {
    expect(
      v.safeParse(Workouts.VO.WorkoutExerciseLaterality, Exercises.VO.ExerciseLateralityOptions.unilateral)
        .success,
    ).toEqual(true);
  });

  test("rejects invalid", () => {
    expect(() => v.parse(Workouts.VO.WorkoutExerciseLaterality, "invalid")).toThrow(
      "workout.exercise.laterality.invalid",
    );
  });
});
