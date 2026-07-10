import type * as tools from "@bgord/tools";

export interface GetExerciseNameCount {
  execute(): Promise<tools.IntegerNonNegativeType>;
}
