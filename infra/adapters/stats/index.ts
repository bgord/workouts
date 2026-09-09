import * as Stats from "+stats";
import { createGetExerciseHistoryQuery } from "./get-exercise-history.adapter";

type Dependencies = { OneRepMaxEstimator: Stats.Ports.OneRepMaxEstimatorPort };

export function createStatsAdapters(deps: Dependencies) {
  const OneRepMaxCandidates = new Stats.Services.OneRepMaxCandidates(deps);

  return { GetExerciseHistoryQuery: createGetExerciseHistoryQuery({ OneRepMaxCandidates }) };
}
