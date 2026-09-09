import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Stats from "+stats";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

const heavier = {
  ...mocks.exerciseRecord,
  load: v.parse(Workouts.VO.Load, 120_000),
} satisfies Stats.VO.ExerciseRecord;

const lighter = {
  ...mocks.exerciseRecord,
  load: v.parse(Workouts.VO.Load, 100_000),
} satisfies Stats.VO.ExerciseRecord;

describe("ExerciseRecordOrder", () => {
  test("heavier load wins", () => {
    expect(Stats.Services.ExerciseRecordOrder.compare(heavier, lighter)).toBeLessThan(0);
    expect(Stats.Services.ExerciseRecordOrder.compare(lighter, heavier)).toBeGreaterThan(0);
  });

  test("equal load - more reps wins", () => {
    const moreReps = { ...lighter, reps: v.parse(Workouts.VO.Reps, lighter.reps + 1) };

    expect(Stats.Services.ExerciseRecordOrder.compare(moreReps, lighter)).toBeLessThan(0);
    expect(Stats.Services.ExerciseRecordOrder.compare(lighter, moreReps)).toBeGreaterThan(0);
  });

  test("equal load and reps - earlier wins", () => {
    const later = { ...lighter, completedAt: mocks.T1.ms };

    expect(Stats.Services.ExerciseRecordOrder.compare(lighter, later)).toBeLessThan(0);
    expect(Stats.Services.ExerciseRecordOrder.compare(later, lighter)).toBeGreaterThan(0);
  });

  test("equal record", () => {
    expect(Stats.Services.ExerciseRecordOrder.compare(lighter, lighter)).toEqual(0);
  });
});
