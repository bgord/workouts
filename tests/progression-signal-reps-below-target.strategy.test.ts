import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ProgressionSignalRepsBelowTargetStrategy", () => {
  test("reps below target", () => {
    const strategy = new Workouts.Services.ProgressionSignalRepsBelowTargetStrategy({
      prescription: mocks.linearExercisePrescription,
      reps: v.parse(Workouts.VO.Reps, 4),
    });

    expect(strategy.calculate()).toEqual(Workouts.VO.ProgressionSignalOptions.reps_below_target);
  });

  test("reps at target", () => {
    const strategy = new Workouts.Services.ProgressionSignalRepsBelowTargetStrategy({
      prescription: mocks.linearExercisePrescription,
      reps: v.parse(Workouts.VO.Reps, 5),
    });

    expect(strategy.calculate()).toEqual(undefined);
  });

  test("reps below target - not linear_progression", () => {
    const strategy = new Workouts.Services.ProgressionSignalRepsBelowTargetStrategy({
      prescription: mocks.exercisePrescription,
      reps: v.parse(Workouts.VO.Reps, 4),
    });

    expect(strategy.calculate()).toEqual(undefined);
  });
});
