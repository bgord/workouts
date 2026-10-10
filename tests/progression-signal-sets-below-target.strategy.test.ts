import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Plans from "+plans";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ProgressionSignalSetsBelowTargetStrategy", () => {
  test("sets below target", () => {
    const strategy = new Workouts.Services.ProgressionSignalSetsBelowTargetStrategy({
      prescription: mocks.exercisePrescription,
      sets: v.parse(Plans.VO.Sets, 2),
    });

    expect(strategy.calculate()).toEqual(Workouts.VO.ProgressionSignalOptions.sets_below_target);
  });

  test("sets at target", () => {
    const strategy = new Workouts.Services.ProgressionSignalSetsBelowTargetStrategy({
      prescription: mocks.exercisePrescription,
      sets: mocks.sets,
    });

    expect(strategy.calculate()).toEqual(undefined);
  });

  test("sets above target", () => {
    const strategy = new Workouts.Services.ProgressionSignalSetsBelowTargetStrategy({
      prescription: mocks.exercisePrescription,
      sets: mocks.anotherSets,
    });

    expect(strategy.calculate()).toEqual(undefined);
  });
});
