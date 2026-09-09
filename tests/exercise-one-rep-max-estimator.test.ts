// cSpell:ignore epley
import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Statistics from "+statistics";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

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
      mocks.exerciseSet,
      mocks.anotherExerciseSet,
    ]);

    expect(await estimator.estimate(mocks.userId, mocks.exerciseId)).toEqual({
      set: mocks.anotherExerciseSet,
      estimate: v.parse(Statistics.VO.OneRepMaxEstimate, 120000),
    });
  });

  test("no sets", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExerciseSetsQuery, "execute").mockResolvedValue([]);

    expect(await estimator.estimate(mocks.userId, mocks.exerciseId)).toEqual(null);
  });

  test("single set", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExerciseSetsQuery, "execute").mockResolvedValue([
      mocks.exerciseSet,
    ]);

    expect(await estimator.estimate(mocks.userId, mocks.exerciseId)).toEqual({
      set: mocks.exerciseSet,
      estimate: v.parse(Statistics.VO.OneRepMaxEstimate, 105000),
    });
  });

  test("estimate wins over load", async () => {
    using _ = spyOn(di.Adapters.Workouts.ListExerciseSetsQuery, "execute").mockResolvedValue([
      mocks.heaviestExerciseSet,
      mocks.anotherExerciseSet,
    ]);

    expect(await estimator.estimate(mocks.userId, mocks.exerciseId)).toEqual({
      set: mocks.anotherExerciseSet,
      estimate: v.parse(Statistics.VO.OneRepMaxEstimate, 120000),
    });
  });
});
