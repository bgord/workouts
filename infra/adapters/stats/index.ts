import * as Stats from "+stats";
import { createGetExerciseEstimatedRecordQuery } from "./get-exercise-estimated-record.adapter";
import { GetExerciseRecordQuery } from "./get-exercise-record.adapter";
import { createListExerciseSessionsQuery } from "./list-exercise-sessions.adapter";

type Dependencies = { OneRepMaxEstimator: Stats.Ports.OneRepMaxEstimatorPort };

export function createStatsAdapters(deps: Dependencies) {
  const OneRepMaxCandidates = new Stats.Services.OneRepMaxCandidates(deps);

  return {
    ListExerciseSessionsQuery: createListExerciseSessionsQuery({ OneRepMaxCandidates }),
    GetExerciseRecordQuery,
    GetExerciseEstimatedRecordQuery: createGetExerciseEstimatedRecordQuery({ OneRepMaxCandidates }),
  };
}
