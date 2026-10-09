import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Exercises from "+exercises";
import * as Workouts from "+workouts";

describe("WorkoutExerciseSides", () => {
  test("totalReps - bilateral", () => {
    expect(
      Workouts.VO.WorkoutExerciseSides.totalReps(
        Exercises.VO.ExerciseLateralityOptions.bilateral,
        v.parse(Workouts.VO.Reps, 5),
      ),
    ).toEqual(5);
  });

  test("totalReps - unilateral", () => {
    expect(
      Workouts.VO.WorkoutExerciseSides.totalReps(
        Exercises.VO.ExerciseLateralityOptions.unilateral,
        v.parse(Workouts.VO.Reps, 5),
      ),
    ).toEqual(10);
  });
});
