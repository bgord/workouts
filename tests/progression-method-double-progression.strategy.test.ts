import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Plans from "+plans";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ProgressionMethodDoubleProgressionStrategy", () => {
  test("below range - regress drops load and goes to range maximum, one rep up", () => {
    const strategy = new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
      { prescription: mocks.exercisePrescription, last: mocks.exercisePerformanceWeakestSet },
      { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
    );

    expect(strategy.calculate()).toEqual(mocks.exerciseTargetProgression);
  });

  test("one below range minimum - regress drops load, progress reaches range minimum", () => {
    const last = v.parse(Workouts.VO.ExerciseTarget, {
      sets: v.parse(Plans.VO.Sets, 1),
      reps: v.parse(Workouts.VO.Reps, 7),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
    });
    const strategy = new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
      { prescription: mocks.exercisePrescription, last },
      { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
    );

    expect(strategy.calculate()).toEqual({
      last,
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 12),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(77.5).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 8),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
      }),
    });
  });

  test("mid range - one rep either way", () => {
    const last = v.parse(Workouts.VO.ExerciseTarget, {
      sets: v.parse(Plans.VO.Sets, 1),
      reps: v.parse(Workouts.VO.Reps, 10),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
    });
    const strategy = new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
      { prescription: mocks.exercisePrescription, last },
      { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
    );

    expect(strategy.calculate()).toEqual({
      last,
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 9),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 11),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
      }),
    });
  });

  test("range minimum - regress drops load and goes to range maximum", () => {
    const last = v.parse(Workouts.VO.ExerciseTarget, {
      sets: v.parse(Plans.VO.Sets, 1),
      reps: v.parse(Workouts.VO.Reps, 8),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
    });
    const strategy = new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
      { prescription: mocks.exercisePrescription, last },
      { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
    );

    expect(strategy.calculate()).toEqual({
      last,
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 12),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(77.5).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 9),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
      }),
    });
  });

  test("range maximum - progress adds load and goes to range minimum", () => {
    const last = v.parse(Workouts.VO.ExerciseTarget, {
      sets: v.parse(Plans.VO.Sets, 1),
      reps: v.parse(Workouts.VO.Reps, 12),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
    });
    const strategy = new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
      { prescription: mocks.exercisePrescription, last },
      { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
    );

    expect(strategy.calculate()).toEqual({
      last,
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 11),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 8),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(82.5).get()),
      }),
    });
  });

  test("above range - treated as range maximum", () => {
    const last = v.parse(Workouts.VO.ExerciseTarget, {
      sets: v.parse(Plans.VO.Sets, 1),
      reps: v.parse(Workouts.VO.Reps, 14),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
    });
    const strategy = new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
      { prescription: mocks.exercisePrescription, last },
      { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
    );

    expect(strategy.calculate()).toEqual({
      last,
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 13),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 8),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(82.5).get()),
      }),
    });
  });

  test("range minimum - no regress below zero load", () => {
    const last = v.parse(Workouts.VO.ExerciseTarget, {
      sets: v.parse(Plans.VO.Sets, 1),
      reps: v.parse(Workouts.VO.Reps, 8),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(2).get()),
    });
    const strategy = new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
      { prescription: mocks.exercisePrescription, last },
      { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
    );

    expect(strategy.calculate()).toEqual({
      last,
      regress: undefined,
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 9),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(2).get()),
      }),
    });
  });

  test("range minimum - regress to zero load", () => {
    const last = v.parse(Workouts.VO.ExerciseTarget, {
      sets: v.parse(Plans.VO.Sets, 1),
      reps: v.parse(Workouts.VO.Reps, 8),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(2.5).get()),
    });
    const strategy = new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
      { prescription: mocks.exercisePrescription, last },
      { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
    );

    expect(strategy.calculate()).toEqual({
      last,
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 12),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 9),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(2.5).get()),
      }),
    });
  });

  test("single rep below range - regress drops load, one rep up", () => {
    const last = v.parse(Workouts.VO.ExerciseTarget, {
      sets: v.parse(Plans.VO.Sets, 1),
      reps: v.parse(Workouts.VO.Reps, 1),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
    });
    const strategy = new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
      { prescription: mocks.exercisePrescription, last },
      { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
    );

    expect(strategy.calculate()).toEqual({
      last,
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 12),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(77.5).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 2),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
      }),
    });
  });

  test("fixed rep range - progress and regress both change load", () => {
    const last = v.parse(Workouts.VO.ExerciseTarget, {
      sets: v.parse(Plans.VO.Sets, 1),
      reps: v.parse(Workouts.VO.Reps, 6),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
    });
    const strategy = new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
      {
        prescription: v.parse(Workouts.VO.ExercisePrescription, {
          sets: mocks.sets,
          reps: mocks.anotherRepsRange,
          progression: mocks.progression,
        }),
        last,
      },
      { LoadStep: new Workouts.Services.LoadStepIncrementStrategy({ step: mocks.loadStep }) },
    );

    expect(strategy.calculate()).toEqual({
      last,
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 6),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(77.5).get()),
      }),
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 6),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(82.5).get()),
      }),
    });
  });

  test("range maximum - locked load - no progress", () => {
    const last = v.parse(Workouts.VO.ExerciseTarget, {
      sets: v.parse(Plans.VO.Sets, 1),
      reps: v.parse(Workouts.VO.Reps, 12),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
    });
    const strategy = new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
      { prescription: mocks.exercisePrescription, last },
      { LoadStep: new Workouts.Services.LoadStepLockedStrategy() },
    );

    expect(strategy.calculate()).toEqual({
      last,
      regress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 11),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
      }),
      progress: undefined,
    });
  });

  test("below range - locked load - no regress", () => {
    const last = v.parse(Workouts.VO.ExerciseTarget, {
      sets: v.parse(Plans.VO.Sets, 1),
      reps: v.parse(Workouts.VO.Reps, 5),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
    });
    const strategy = new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
      { prescription: mocks.exercisePrescription, last },
      { LoadStep: new Workouts.Services.LoadStepLockedStrategy() },
    );

    expect(strategy.calculate()).toEqual({
      last,
      regress: undefined,
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 6),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
      }),
    });
  });

  test("range minimum - locked load - no regress", () => {
    const last = v.parse(Workouts.VO.ExerciseTarget, {
      sets: v.parse(Plans.VO.Sets, 1),
      reps: v.parse(Workouts.VO.Reps, 8),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
    });
    const strategy = new Workouts.Services.ProgressionMethodDoubleProgressionStrategy(
      { prescription: mocks.exercisePrescription, last },
      { LoadStep: new Workouts.Services.LoadStepLockedStrategy() },
    );

    expect(strategy.calculate()).toEqual({
      last,
      regress: undefined,
      progress: v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Plans.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 9),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
      }),
    });
  });
});
