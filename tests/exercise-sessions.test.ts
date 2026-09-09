// cSpell:ignore brzycki
import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Stats from "+stats";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

const exerciseSessions = new Stats.Services.ExerciseSessions({
  OneRepMaxCandidates: new Stats.Services.OneRepMaxCandidates({
    OneRepMaxEstimator: new Stats.Services.OneRepMaxEstimatorBrzycki(),
  }),
});

const performed = { workoutId: mocks.workoutId, completedAt: mocks.T0.ms };
const logged = { ...performed, userId: mocks.userId, exerciseId: mocks.exerciseId };

const lighterFiveRepSet = {
  reps: v.parse(Workouts.VO.Reps, 5),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
} satisfies Stats.VO.PerformedSet;

const singleRep = { ...logged, ...mocks.singleRepSet };
const fiveReps = { ...logged, ...mocks.fiveRepSet };
const lighterFiveReps = { ...logged, ...lighterFiveRepSet };
const aboveRepLimit = { ...logged, ...mocks.aboveRepLimitSet };

describe("ExerciseSessions", () => {
  test("no sets", () => {
    expect(exerciseSessions.from([])).toEqual([]);
  });

  test("one session per exercise", () => {
    const other = { ...fiveReps, exerciseId: mocks.anotherExerciseId };

    expect(exerciseSessions.from([singleRep, other]).map((session) => session.exerciseId)).toEqual([
      mocks.exerciseId,
      mocks.anotherExerciseId,
    ]);
  });

  test("keeps the given set order", () => {
    const [session] = exerciseSessions.from([fiveReps, singleRep]);

    expect(session?.sets).toEqual([mocks.fiveRepSet, mocks.singleRepSet]);
  });

  test("volume of all sets", () => {
    const [session] = exerciseSessions.from([singleRep, fiveReps]);

    expect(session?.volume).toEqual(v.parse(Stats.VO.Volume, 600_000));
  });

  test("estimate of the best set", () => {
    const [session] = exerciseSessions.from([singleRep, lighterFiveReps]);

    expect(session?.estimated).toEqual({
      ...performed,
      ...lighterFiveRepSet,
      oneRepMaxEstimate: v.parse(Stats.VO.OneRepMaxEstimate, 101_250),
    });
  });

  test("no estimate when no set qualifies", () => {
    const [session] = exerciseSessions.from([aboveRepLimit]);

    expect(session?.estimated).toBeUndefined();
  });

  test("top set is the heaviest, not the best estimate", () => {
    const [session] = exerciseSessions.from([singleRep, lighterFiveReps]);

    expect(session?.topSet).toEqual({ ...performed, ...mocks.singleRepSet });
  });

  test("top set with an equal load is the one with more reps", () => {
    const [session] = exerciseSessions.from([singleRep, fiveReps]);

    expect(session?.topSet).toEqual({ ...performed, ...mocks.fiveRepSet });
  });
});
