import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Exercises from "+exercises";
import * as Workouts from "+workouts";

describe("WorkoutExerciseResistance", () => {
  test("happy path", () => {
    expect(
      v.safeParse(Workouts.VO.WorkoutExerciseResistance, Exercises.VO.ExerciseResistanceOptions.weighted)
        .success,
    ).toEqual(true);
  });

  test("rejects invalid", () => {
    expect(() => v.parse(Workouts.VO.WorkoutExerciseResistance, "invalid")).toThrow(
      "workout.exercise.resistance.invalid",
    );
  });
});
