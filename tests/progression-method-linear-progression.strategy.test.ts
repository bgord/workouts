import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ProgressionMethodLinearProgressionStrategy", () => {
  test("load step either way, reps unchanged", () => {
    const strategy = new Workouts.Services.ProgressionMethodLinearProgressionStrategy(
      mocks.exercisePerformance,
    );

    expect(strategy.calculate()).toEqual({
      last: mocks.exercisePerformanceWeakestSet,
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 2),
        reps: v.parse(Workouts.VO.Reps, 5),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(87.5).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 2),
        reps: v.parse(Workouts.VO.Reps, 5),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(92.5).get()),
      }),
    });
  });

  test("load at the step - regress reaches zero", () => {
    const strategy = new Workouts.Services.ProgressionMethodLinearProgressionStrategy({
      ...mocks.exercisePerformance,
      sets: [
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 1),
          reps: v.parse(Workouts.VO.Reps, 8),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(2.5).get()),
          rir: null,
        },
      ],
    });

    expect(strategy.calculate()).toEqual({
      last: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 8),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(2.5).get()),
      }),
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 8),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 8),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(5).get()),
      }),
    });
  });

  test("load below the step - no regress", () => {
    const strategy = new Workouts.Services.ProgressionMethodLinearProgressionStrategy({
      ...mocks.exercisePerformance,
      sets: [
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 1),
          reps: v.parse(Workouts.VO.Reps, 8),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
          rir: null,
        },
      ],
    });

    expect(strategy.calculate()).toEqual({
      last: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 8),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
      }),
      regress: undefined,
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 8),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(2.5).get()),
      }),
    });
  });
});
