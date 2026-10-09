import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("WorkoutProgress", () => {
  test("calculate - no exercises", () => {
    const progress = new Workouts.Services.WorkoutProgress({ exercises: [] });

    expect(progress.calculate()).toEqual({
      logged: tools.Int.nonNegative(0),
      total: tools.Int.nonNegative(0),
      next: null,
    });
  });

  test("calculate - no logged sets", () => {
    const progress = new Workouts.Services.WorkoutProgress({
      exercises: [mocks.workoutExerciseWithoutTarget],
    });

    expect(progress.calculate()).toEqual({
      logged: tools.Int.nonNegative(0),
      total: tools.Int.nonNegative(1),
      next: mocks.anotherWorkoutExerciseId,
    });
  });

  test("calculate - some exercises logged", () => {
    const progress = new Workouts.Services.WorkoutProgress({
      exercises: [mocks.workoutExerciseWithoutTarget, mocks.workoutExercise],
    });

    expect(progress.calculate()).toEqual({
      logged: tools.Int.nonNegative(1),
      total: tools.Int.nonNegative(2),
      next: mocks.anotherWorkoutExerciseId,
    });
  });

  test("calculate - all exercises logged", () => {
    const progress = new Workouts.Services.WorkoutProgress({
      exercises: [
        mocks.workoutExerciseWithoutTargetLogged,
        mocks.workoutExerciseWithoutTargetLogged,
        mocks.workoutExercise,
      ],
    });

    expect(progress.calculate()).toEqual({
      logged: tools.Int.nonNegative(3),
      total: tools.Int.nonNegative(3),
      next: mocks.workoutExerciseId,
    });
  });
});
