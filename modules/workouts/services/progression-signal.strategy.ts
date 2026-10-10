import type * as VO from "+workouts/value-objects";

export interface ProgressionSignalStrategy {
  calculate(): VO.ProgressionHoldReasonOptions | undefined;
}
