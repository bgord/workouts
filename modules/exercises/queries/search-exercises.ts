import type * as tools from "@bgord/tools";
import type * as VO from "+exercises/value-objects";

export interface SearchExercises {
  execute(name: VO.ExerciseNameType, limit: tools.IntegerPositiveType): Promise<ReadonlyArray<VO.Exercise>>;
}
