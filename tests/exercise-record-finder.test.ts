import { describe, expect, test } from "bun:test";
import * as Stats from "+stats";
import * as mocks from "./mocks";

const finder = new Stats.Services.ExerciseRecordFinder();

describe("ExerciseRecordFinder", () => {
  test("empty history", () => {
    expect(finder.find([])).toBeUndefined();
  });

  test("a session without sets", () => {
    expect(finder.find([{ ...mocks.exerciseSession, sets: [] }])).toBeUndefined();
  });

  test("the only set", () => {
    expect(finder.find([mocks.exerciseSession])).toEqual(mocks.exerciseRecord);
  });

  test("the heaviest load wins", () => {
    const heavier = {
      ...mocks.exerciseSession,
      completedAt: mocks.T1.ms,
      sets: [mocks.correctedLoggedSet],
    };

    expect(finder.find([mocks.exerciseSession, heavier])).toEqual({
      reps: mocks.correctedLoggedSet.reps,
      load: mocks.correctedLoggedSet.load,
      workoutId: mocks.workoutId,
      completedAt: mocks.T1.ms,
    });
  });

  test("the heaviest load wins among the sets of one session", () => {
    const session = { ...mocks.exerciseSession, sets: [mocks.loggedSet, mocks.correctedLoggedSet] };

    expect(finder.find([session])).toEqual({
      reps: mocks.correctedLoggedSet.reps,
      load: mocks.correctedLoggedSet.load,
      workoutId: mocks.workoutId,
      completedAt: mocks.T0.ms,
    });
  });

  test("most reps win", () => {
    const fewerReps = {
      ...mocks.exerciseSession,
      completedAt: mocks.T1.ms,
      sets: [{ ...mocks.loggedSet, reps: mocks.correctedLoggedSet.reps }],
    };

    expect(finder.find([mocks.exerciseSession, fewerReps])).toEqual(mocks.exerciseRecord);
  });

  test("tied record keeps the earliest session", () => {
    const later = { ...mocks.exerciseSession, completedAt: mocks.T1.ms };

    expect(finder.find([later, mocks.exerciseSession])).toEqual(mocks.exerciseRecord);
  });
});
