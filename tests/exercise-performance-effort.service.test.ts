import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ExercisePerformanceEffort", () => {
  test("happy path", () => {
    const effort = new Workouts.Services.ExercisePerformanceEffort(mocks.exercisePerformanceWithRir);

    expect(effort.calculate()).toEqual(v.parse(Workouts.VO.Rir, 1));
  });

  test("no rir logged", () => {
    const effort = new Workouts.Services.ExercisePerformanceEffort(mocks.exercisePerformance);

    expect(effort.calculate()).toEqual(undefined);
  });

  test("one set without rir", () => {
    const effort = new Workouts.Services.ExercisePerformanceEffort({
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

    expect(effort.calculate()).toEqual(undefined);
  });

  test("no sets", () => {
    const effort = new Workouts.Services.ExercisePerformanceEffort({ sets: [] });

    expect(effort.calculate()).toEqual(undefined);
  });
});
