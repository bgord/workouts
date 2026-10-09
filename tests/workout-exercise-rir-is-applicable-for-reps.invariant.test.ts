import { describe, expect, test } from "bun:test";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("WorkoutExerciseRirIsApplicableForReps", () => {
  test("passes - range with rir", () => {
    const config = mocks.rirExercisePrescription;

    expect(Workouts.Invariants.WorkoutExerciseRirIsApplicableForReps.passes(config)).toEqual(true);
  });

  test("passes - amrap without rir", () => {
    const config = mocks.amrapExercisePrescription;

    expect(Workouts.Invariants.WorkoutExerciseRirIsApplicableForReps.passes(config)).toEqual(true);
  });

  test("fails - amrap with rir", () => {
    const config = mocks.amrapRirExercisePrescription;

    expect(Workouts.Invariants.WorkoutExerciseRirIsApplicableForReps.passes(config)).toEqual(false);
  });

  test("enforce - throws", () => {
    const config = mocks.amrapRirExercisePrescription;

    expect(() => Workouts.Invariants.WorkoutExerciseRirIsApplicableForReps.enforce(config)).toThrow(
      Workouts.Invariants.WorkoutExerciseRirIsApplicableForReps.error,
    );
  });
});
