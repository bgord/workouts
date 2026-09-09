import { GetExerciseEstimatedRecordQuery } from "./get-exercise-estimated-record.adapter";
import { GetExerciseRecordQuery } from "./get-exercise-record.adapter";
import { ListExerciseSessionsQuery } from "./list-exercise-sessions.adapter";

export function createStatsAdapters() {
  return { ListExerciseSessionsQuery, GetExerciseRecordQuery, GetExerciseEstimatedRecordQuery };
}
