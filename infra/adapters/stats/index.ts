import { createGetExerciseHistoryQuery } from "./get-exercise-history.adapter";

export function createStatsAdapters() {
  return { GetExerciseHistoryQuery: createGetExerciseHistoryQuery() };
}
