import type * as Plans from "+plans";
import * as VO from "+workouts/value-objects";
import type { ProgressionSignalStrategy } from "./progression-signal.strategy";

type Config = { prescription: VO.ExercisePrescriptionType; sets: Plans.VO.SetsType };

export class ProgressionSignalSetsBelowTargetStrategy implements ProgressionSignalStrategy {
  constructor(private readonly config: Config) {}

  calculate(): VO.ProgressionSignalOptions | undefined {
    const { prescription, sets } = this.config;

    if (sets >= prescription.sets) return undefined;

    return VO.ProgressionSignalOptions.sets_below_target;
  }
}
