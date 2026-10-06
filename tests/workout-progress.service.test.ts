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
    });
  });

  test("calculate - no logged sets", () => {
    const progress = new Workouts.Services.WorkoutProgress({
      exercises: [mocks.workoutExerciseWithoutTarget],
    });

    expect(progress.calculate()).toEqual({
      logged: tools.Int.nonNegative(0),
      total: tools.Int.nonNegative(1),
    });
  });

  test("calculate - some exercises logged", () => {
    const progress = new Workouts.Services.WorkoutProgress({
      exercises: [mocks.workoutExercise, mocks.workoutExerciseWithoutTarget],
    });

    expect(progress.calculate()).toEqual({
      logged: tools.Int.nonNegative(1),
      total: tools.Int.nonNegative(2),
    });
  });
});
