// cSpell:ignore epley
import * as tools from "@bgord/tools";
import * as Statistics from "+statistics";
import type * as Workouts from "+workouts";
import { createGetExerciseOneRepMaxEstimate } from "./get-exercise-one-rep-max-estimate.adapter";

type Dependencies = { ListExerciseSetsOHQ: Workouts.OHQ.ListExerciseSetsOHQ };

export function createStatisticsAdapters(deps: Dependencies) {
  return {
    GetExerciseOneRepMaxEstimateQuery: createGetExerciseOneRepMaxEstimate({
      ...deps,
      OneRepEstimator: new Statistics.Services.OneRepEstimatorEpley({
        rounding: new tools.RoundingToNearestStrategy(),
      }),
    }),
  };
}
