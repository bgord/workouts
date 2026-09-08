import type * as Stats from "+stats";
import { createGetExerciseHistoryQuery } from "./get-exercise-history.adapter";

type Dependencies = { OneRepMaxEstimator: Stats.Ports.OneRepMaxEstimatorPort };

export function createStatsAdapters(deps: Dependencies) {
  return { GetExerciseHistoryQuery: createGetExerciseHistoryQuery(deps) };
}
