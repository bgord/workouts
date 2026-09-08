import type * as bg from "@bgord/bun";
import { createGetExerciseHistoryQuery } from "./get-exercise-history.adapter";

type Dependencies = { Clock: bg.ClockPort };

export function createStatsAdapters(deps: Dependencies) {
  return { GetExerciseHistoryQuery: createGetExerciseHistoryQuery(deps) };
}
