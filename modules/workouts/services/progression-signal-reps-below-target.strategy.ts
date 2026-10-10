import * as Plans from "+plans";
import * as VO from "+workouts/value-objects";
import type { ProgressionSignalStrategy } from "./progression-signal.strategy";

type Config = { prescription: VO.ExercisePrescriptionType; reps: VO.RepsType };

export class ProgressionSignalRepsBelowTargetStrategy implements ProgressionSignalStrategy {
  private static readonly applicable: ReadonlyArray<Plans.VO.ProgressionMethodOptions> = [
    Plans.VO.ProgressionMethodOptions.linear_progression,
  ];

  constructor(private readonly config: Config) {}

  calculate(): VO.ProgressionHoldReasonOptions | undefined {
    const { prescription, reps } = this.config;

    if (!ProgressionSignalRepsBelowTargetStrategy.applicable.includes(prescription.progression))
      return undefined;
    if (reps >= prescription.reps.min) return undefined;

    return VO.ProgressionHoldReasonOptions.reps_below_target;
  }
}
