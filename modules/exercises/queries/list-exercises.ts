import type * as VO from "+exercises/value-objects";

export interface ListExercises {
  execute(): Promise<ReadonlyArray<VO.Exercise>>;
}
