import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("DoubleProgressionCalculator", () => {
  test("below range - no progress, one rep down", () => {
    const calculator = new Workouts.Services.DoubleProgressionCalculator(
      mocks.exercisePrescription,
      mocks.exercisePerformance,
    );

    expect(calculator.calculate()).toEqual(mocks.exerciseTargetProgression);
  });

  test("mid range - one rep either way", () => {
    const calculator = new Workouts.Services.DoubleProgressionCalculator(mocks.exercisePrescription, {
      ...mocks.exercisePerformance,
      sets: [
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 1),
          reps: v.parse(Workouts.VO.Reps, 10),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
        },
      ],
    });

    expect(calculator.calculate()).toEqual({
      last: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 10),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
      }),
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 9),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 11),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
      }),
    });
  });

  test("range minimum - regress drops load and goes to range maximum", () => {
    const calculator = new Workouts.Services.DoubleProgressionCalculator(mocks.exercisePrescription, {
      ...mocks.exercisePerformance,
      sets: [
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 1),
          reps: v.parse(Workouts.VO.Reps, 8),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
        },
      ],
    });

    expect(calculator.calculate()).toEqual({
      last: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 8),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
      }),
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 12),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(77.5).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 9),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
      }),
    });
  });

  test("range maximum - progress adds load and goes to range minimum", () => {
    const calculator = new Workouts.Services.DoubleProgressionCalculator(mocks.exercisePrescription, {
      ...mocks.exercisePerformance,
      sets: [
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 1),
          reps: v.parse(Workouts.VO.Reps, 12),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
        },
      ],
    });

    expect(calculator.calculate()).toEqual({
      last: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 12),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
      }),
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 11),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 8),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(82.5).get()),
      }),
    });
  });

  test("above range - treated as range maximum", () => {
    const calculator = new Workouts.Services.DoubleProgressionCalculator(mocks.exercisePrescription, {
      ...mocks.exercisePerformance,
      sets: [
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 1),
          reps: v.parse(Workouts.VO.Reps, 14),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
        },
      ],
    });

    expect(calculator.calculate()).toEqual({
      last: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 14),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
      }),
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 13),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 8),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(82.5).get()),
      }),
    });
  });

  test("range minimum - no regress below zero load", () => {
    const calculator = new Workouts.Services.DoubleProgressionCalculator(mocks.exercisePrescription, {
      ...mocks.exercisePerformance,
      sets: [
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 1),
          reps: v.parse(Workouts.VO.Reps, 8),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(2).get()),
        },
      ],
    });

    expect(calculator.calculate()).toEqual({
      last: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 8),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(2).get()),
      }),
      regress: undefined,
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 9),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(2).get()),
      }),
    });
  });

  test("range minimum - regress to zero load", () => {
    const calculator = new Workouts.Services.DoubleProgressionCalculator(mocks.exercisePrescription, {
      ...mocks.exercisePerformance,
      sets: [
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 1),
          reps: v.parse(Workouts.VO.Reps, 8),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(2.5).get()),
        },
      ],
    });

    expect(calculator.calculate()).toEqual({
      last: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 8),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(2.5).get()),
      }),
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 12),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 9),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(2.5).get()),
      }),
    });
  });

  test("single rep below range - no regress", () => {
    const calculator = new Workouts.Services.DoubleProgressionCalculator(mocks.exercisePrescription, {
      ...mocks.exercisePerformance,
      sets: [
        {
          setNumber: v.parse(Workouts.VO.SetNumber, 1),
          reps: v.parse(Workouts.VO.Reps, 1),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
        },
      ],
    });

    expect(calculator.calculate()).toEqual({
      last: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 1),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
      }),
      regress: undefined,
      progress: undefined,
    });
  });

  test("fixed rep range - progress and regress both change load", () => {
    const calculator = new Workouts.Services.DoubleProgressionCalculator(
      v.parse(Workouts.VO.ExercisePrescription, { sets: mocks.sets, reps: mocks.anotherReps }),
      {
        ...mocks.exercisePerformance,
        sets: [
          {
            setNumber: v.parse(Workouts.VO.SetNumber, 1),
            reps: v.parse(Workouts.VO.Reps, 6),
            load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
          },
        ],
      },
    );

    expect(calculator.calculate()).toEqual({
      last: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 6),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
      }),
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 6),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(77.5).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 6),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(82.5).get()),
      }),
    });
  });
});
