import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ExerciseTargetDiffCalculator", () => {
  test("happy path", () => {
    const calculator = new Workouts.Services.ExerciseTargetDiffCalculator(
      mocks.exerciseTarget,
      mocks.exercisePerformance,
    );

    expect(calculator.calculate()).toEqual({
      sets: v.parse(tools.Integer, 1),
      reps: v.parse(tools.Integer, 4),
      load: v.parse(tools.Integer, -tools.Weight.fromKilograms(10).get()),
    });
  });

  test("no change", () => {
    const calculator = new Workouts.Services.ExerciseTargetDiffCalculator(mocks.exerciseTarget, {
      ...mocks.exercisePerformance,
      sets: [
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 1),
          reps: v.parse(Workouts.VO.Reps, 9),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
        },
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 2),
          reps: v.parse(Workouts.VO.Reps, 9),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
        },
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 3),
          reps: v.parse(Workouts.VO.Reps, 9),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
        },
      ],
    });

    expect(calculator.calculate()).toEqual({
      sets: v.parse(tools.Integer, 0),
      reps: v.parse(tools.Integer, 0),
      load: v.parse(tools.Integer, 0),
    });
  });

  test("reps - weakest set", () => {
    const calculator = new Workouts.Services.ExerciseTargetDiffCalculator(mocks.exerciseTarget, {
      ...mocks.exercisePerformance,
      sets: [
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 1),
          reps: v.parse(Workouts.VO.Reps, 9),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
        },
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 2),
          reps: v.parse(Workouts.VO.Reps, 9),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
        },
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 3),
          reps: v.parse(Workouts.VO.Reps, 8),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
        },
      ],
    });

    expect(calculator.calculate()).toEqual({
      sets: v.parse(tools.Integer, 0),
      reps: v.parse(tools.Integer, 1),
      load: v.parse(tools.Integer, 0),
    });
  });

  test("load - weakest set", () => {
    const calculator = new Workouts.Services.ExerciseTargetDiffCalculator(mocks.exerciseTarget, {
      ...mocks.exercisePerformance,
      sets: [
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 1),
          reps: v.parse(Workouts.VO.Reps, 9),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
        },
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 2),
          reps: v.parse(Workouts.VO.Reps, 9),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(77.5).get()),
        },
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 3),
          reps: v.parse(Workouts.VO.Reps, 9),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
        },
      ],
    });

    expect(calculator.calculate()).toEqual({
      sets: v.parse(tools.Integer, 0),
      reps: v.parse(tools.Integer, 0),
      load: v.parse(tools.Integer, tools.Weight.fromKilograms(2.5).get()),
    });
  });

  test("fewer sets", () => {
    const calculator = new Workouts.Services.ExerciseTargetDiffCalculator(mocks.exerciseTarget, {
      ...mocks.exercisePerformance,
      sets: [
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 1),
          reps: v.parse(Workouts.VO.Reps, 9),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
        },
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 2),
          reps: v.parse(Workouts.VO.Reps, 9),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
        },
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 3),
          reps: v.parse(Workouts.VO.Reps, 9),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
        },
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 4),
          reps: v.parse(Workouts.VO.Reps, 9),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
        },
      ],
    });

    expect(calculator.calculate()).toEqual({
      sets: v.parse(tools.Integer, -1),
      reps: v.parse(tools.Integer, 0),
      load: v.parse(tools.Integer, 0),
    });
  });
});
