import type * as Plans from "+plans";
import * as VO from "+workouts/value-objects";
import type { ProgressionSignalStrategy } from "./progression-signal.strategy";

type Config = { prescription: VO.ExercisePrescriptionType; sets: Plans.VO.SetsType };

export class ProgressionSignalSetsBelowTargetStrategy implements ProgressionSignalStrategy {
  constructor(private readonly config: Config) {}

  calculate(): VO.ProgressionHoldReasonOptions | undefined {
    const { prescription, sets } = this.config;

    if (sets >= prescription.sets) return undefined;

    return VO.ProgressionHoldReasonOptions.sets_below_target;
  }
}
