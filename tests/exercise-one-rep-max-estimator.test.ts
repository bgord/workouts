// cSpell:ignore epley
import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Statistics from "+statistics";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

const exerciseSet = {
  id: mocks.loggedSetId,
  workoutId: mocks.workoutId,
  reps: v.parse(Workouts.VO.Reps, 5),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
};

const anotherExerciseSet = {
  id: mocks.anotherLoggedSetId,
  workoutId: mocks.workoutId,
  reps: v.parse(Workouts.VO.Reps, 10),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
};

const heaviestExerciseSet = {
  id: mocks.anotherLoggedSetId,
  workoutId: mocks.workoutId,
  reps: v.parse(Workouts.VO.Reps, 1),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(100).get()),
};

describe("ExerciseOneRepMaxEstimator", async () => {
  const di = await bootstrap();

  const estimator = new Statistics.Services.ExerciseOneRepMaxEstimator({
    OneRepEstimator: new Statistics.Services.OneRepEstimatorEpley({
      rounding: new tools.RoundingToNearestStrategy(),
    }),
    ListExerciseSetsOHQ: di.Adapters.Workouts.ListExerciseSetsQuery,
  });

  test("happy path", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExerciseSetsQuery, "execute").mockResolvedValue([
      exerciseSet,
      anotherExerciseSet,
    ]);

    expect(await estimator.estimate(mocks.userId, mocks.exerciseId)).toEqual({
      set: anotherExerciseSet,
      estimate: v.parse(Statistics.VO.OneRepMaxEstimate, 106667),
    });
  });

  test("no sets", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExerciseSetsQuery, "execute").mockResolvedValue([]);

    expect(await estimator.estimate(mocks.userId, mocks.exerciseId)).toEqual(null);
  });

  test("single set", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExerciseSetsQuery, "execute").mockResolvedValue([exerciseSet]);

    expect(await estimator.estimate(mocks.userId, mocks.exerciseId)).toEqual({
      set: exerciseSet,
      estimate: v.parse(Statistics.VO.OneRepMaxEstimate, 105000),
    });
  });

  test("estimate wins over load", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExerciseSetsQuery, "execute").mockResolvedValue([
      heaviestExerciseSet,
      anotherExerciseSet,
    ]);

    expect(await estimator.estimate(mocks.userId, mocks.exerciseId)).toEqual({
      set: anotherExerciseSet,
      estimate: v.parse(Statistics.VO.OneRepMaxEstimate, 106667),
    });
  });
});
