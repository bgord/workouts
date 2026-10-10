import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Plans from "+plans";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ExercisePrescriptionMissed", () => {
  test("hit", () => {
    const missed = new Workouts.Services.ExercisePrescriptionMissed({
      prescription: {
        ...mocks.exercisePrescription,
        sets: v.parse(Plans.VO.Sets, 2),
        reps: mocks.amrapRepsRange,
      },
      performance: mocks.exercisePerformance,
    });

    expect(missed.calculate()).toEqual(false);
  });

  test("missed - sets", () => {
    const missed = new Workouts.Services.ExercisePrescriptionMissed({
      prescription: { ...mocks.exercisePrescription, reps: mocks.amrapRepsRange },
      performance: mocks.exercisePerformance,
    });

    expect(missed.calculate()).toEqual(true);
  });

  test("missed - reps", () => {
    const missed = new Workouts.Services.ExercisePrescriptionMissed({
      prescription: { ...mocks.exercisePrescription, sets: v.parse(Plans.VO.Sets, 2) },
      performance: mocks.exercisePerformance,
    });

    expect(missed.calculate()).toEqual(true);
  });

  test("missed - rir", () => {
    const missed = new Workouts.Services.ExercisePrescriptionMissed({
      prescription: {
        ...mocks.exercisePrescription,
        sets: v.parse(Plans.VO.Sets, 2),
        reps: mocks.amrapRepsRange,
        rir: mocks.rirTarget,
      },
      performance: mocks.exercisePerformanceWithRir,
    });

    expect(missed.calculate()).toEqual(true);
  });

  test("hit - rir at target", () => {
    const missed = new Workouts.Services.ExercisePrescriptionMissed({
      prescription: {
        ...mocks.exercisePrescription,
        sets: v.parse(Plans.VO.Sets, 2),
        reps: mocks.amrapRepsRange,
        rir: v.parse(Plans.VO.RirTarget, 1),
      },
      performance: mocks.exercisePerformanceWithRir,
    });

    expect(missed.calculate()).toEqual(false);
  });

  test("hit - no rir logged", () => {
    const missed = new Workouts.Services.ExercisePrescriptionMissed({
      prescription: {
        ...mocks.exercisePrescription,
        sets: v.parse(Plans.VO.Sets, 2),
        reps: mocks.amrapRepsRange,
        rir: mocks.rirTarget,
      },
      performance: mocks.exercisePerformance,
    });

    expect(missed.calculate()).toEqual(false);
  });
});
