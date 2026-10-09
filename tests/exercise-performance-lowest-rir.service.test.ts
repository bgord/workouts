import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ExercisePerformanceLowestRir", () => {
  test("happy path", () => {
    const lowestRir = new Workouts.Services.ExercisePerformanceLowestRir(mocks.exercisePerformanceWithRir);

    expect(lowestRir.calculate()).toEqual(v.parse(Workouts.VO.Rir, 1));
  });

  test("no rir logged", () => {
    const lowestRir = new Workouts.Services.ExercisePerformanceLowestRir(mocks.exercisePerformance);

    expect(lowestRir.calculate()).toEqual(undefined);
  });

  test("one set without rir", () => {
    const lowestRir = new Workouts.Services.ExercisePerformanceLowestRir({
      sets: [
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 1),
          reps: v.parse(Workouts.VO.Reps, 10),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
          rir: v.parse(Workouts.VO.Rir, 2),
        },
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 2),
          reps: v.parse(Workouts.VO.Reps, 10),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
          rir: null,
        },
      ],
    });

    expect(lowestRir.calculate()).toEqual(v.parse(Workouts.VO.Rir, 2));
  });

  test("no sets", () => {
    const lowestRir = new Workouts.Services.ExercisePerformanceLowestRir({ sets: [] });

    expect(lowestRir.calculate()).toEqual(undefined);
  });
});
