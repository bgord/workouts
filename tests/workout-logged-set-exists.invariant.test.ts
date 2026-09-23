import { describe, expect, test } from "bun:test";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("WorkoutLoggedSetExists", () => {
  test("passes - logged set present", () => {
    const config = { workoutExercise: mocks.workoutExercise, loggedSetId: mocks.loggedSetId };

    expect(Workouts.Invariants.WorkoutLoggedSetExists.passes(config)).toEqual(true);
  });

  test("fails - logged set absent among other logged sets", () => {
    const config = { workoutExercise: mocks.workoutExercise, loggedSetId: mocks.anotherLoggedSetId };

    expect(Workouts.Invariants.WorkoutLoggedSetExists.passes(config)).toEqual(false);
  });

  test("fails - no workout exercise", () => {
    const config = { workoutExercise: undefined, loggedSetId: mocks.loggedSetId };

    expect(Workouts.Invariants.WorkoutLoggedSetExists.passes(config)).toEqual(false);
  });

  test("enforce - throws", () => {
    const config = { workoutExercise: mocks.workoutExercise, loggedSetId: mocks.anotherLoggedSetId };

    expect(() => Workouts.Invariants.WorkoutLoggedSetExists.enforce(config)).toThrow(
      Workouts.Invariants.WorkoutLoggedSetExists.error,
    );
  });
});
