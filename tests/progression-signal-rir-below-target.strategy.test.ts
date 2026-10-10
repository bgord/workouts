import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ProgressionSignalRirBelowTargetStrategy", () => {
  test("rir below target", () => {
    const strategy = new Workouts.Services.ProgressionSignalRirBelowTargetStrategy({
      prescription: mocks.rirExercisePrescription,
      rir: v.parse(Workouts.VO.Rir, 1),
    });

    expect(strategy.calculate()).toEqual(Workouts.VO.ProgressionHoldReasonOptions.rir_below_target);
  });

  test("rir at target", () => {
    const strategy = new Workouts.Services.ProgressionSignalRirBelowTargetStrategy({
      prescription: mocks.rirExercisePrescription,
      rir: v.parse(Workouts.VO.Rir, 2),
    });

    expect(strategy.calculate()).toEqual(undefined);
  });

  test("rir unknown", () => {
    const strategy = new Workouts.Services.ProgressionSignalRirBelowTargetStrategy({
      prescription: mocks.rirExercisePrescription,
      rir: undefined,
    });

    expect(strategy.calculate()).toEqual(undefined);
  });

  test("no rir target", () => {
    const strategy = new Workouts.Services.ProgressionSignalRirBelowTargetStrategy({
      prescription: mocks.exercisePrescription,
      rir: v.parse(Workouts.VO.Rir, 0),
    });

    expect(strategy.calculate()).toEqual(undefined);
  });
});
