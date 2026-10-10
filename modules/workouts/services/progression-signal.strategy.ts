import type * as VO from "+workouts/value-objects";

export interface ProgressionSignalStrategy {
  readonly blocksProgress: boolean;

  calculate(): VO.ProgressionSignalOptions | undefined;
}
