import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Plans from "+plans";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ProgressionMethodRepProgressionStrategy", () => {
  test("below range maximum - one rep either way, load unchanged", () => {
    const strategy = new Workouts.Services.ProgressionMethodRepProgressionStrategy({
      prescription: mocks.exercisePrescription,
      last: mocks.exercisePerformanceWeakestSet,
    });

    expect(strategy.calculate()).toEqual({
      last: mocks.exercisePerformanceWeakestSet,
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 2),
        reps: v.parse(Workouts.VO.Reps, 4),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 2),
        reps: v.parse(Workouts.VO.Reps, 6),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
      }),
    });
  });

  test("at range maximum - no progress", () => {
    const last = v.parse(Workouts.VO.ExerciseTarget, {
      sets: v.parse(Plans.VO.Sets, 1),
      reps: v.parse(Workouts.VO.Reps, 12),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
    });
    const strategy = new Workouts.Services.ProgressionMethodRepProgressionStrategy({
      prescription: mocks.exercisePrescription,
      last,
    });

    expect(strategy.calculate()).toEqual({
      last,
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 11),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
      }),
      progress: undefined,
    });
  });

  test("amrap - progress beyond any maximum", () => {
    const last = v.parse(Workouts.VO.ExerciseTarget, {
      sets: v.parse(Plans.VO.Sets, 1),
      reps: v.parse(Workouts.VO.Reps, 12),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
    });
    const strategy = new Workouts.Services.ProgressionMethodRepProgressionStrategy({
      prescription: mocks.amrapExercisePrescription,
      last,
    });

    expect(strategy.calculate()).toEqual({
      last,
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 11),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 13),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
      }),
    });
  });

  test("one rep - no regress", () => {
    const last = v.parse(Workouts.VO.ExerciseTarget, {
      sets: v.parse(Plans.VO.Sets, 1),
      reps: v.parse(Workouts.VO.Reps, 1),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
    });
    const strategy = new Workouts.Services.ProgressionMethodRepProgressionStrategy({
      prescription: mocks.amrapExercisePrescription,
      last,
    });

    expect(strategy.calculate()).toEqual({
      last,
      regress: undefined,
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 2),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
      }),
    });
  });
});
