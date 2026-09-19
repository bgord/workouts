import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ExercisePerformanceWeakestSet", () => {
  test("happy path", () => {
    const weakest = new Workouts.Services.ExercisePerformanceWeakestSet(mocks.exercisePerformance);

    expect(weakest.calculate()).toEqual(mocks.exercisePerformanceWeakestSet);
  });

  test("reps and load from different sets", () => {
    const weakest = new Workouts.Services.ExercisePerformanceWeakestSet({
      ...mocks.exercisePerformance,
      sets: [
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 1),
          reps: v.parse(Workouts.VO.Reps, 8),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
        },
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 2),
          reps: v.parse(Workouts.VO.Reps, 10),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(70).get()),
        },
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 3),
          reps: v.parse(Workouts.VO.Reps, 9),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
        },
      ],
    });

    expect(weakest.calculate()).toEqual({
      sets: v.parse(Workouts.VO.Sets, 3),
      reps: v.parse(Workouts.VO.Reps, 8),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(70).get()),
    });
  });
});
