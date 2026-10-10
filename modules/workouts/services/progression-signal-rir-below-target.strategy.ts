import * as VO from "+workouts/value-objects";
import type { ProgressionSignalStrategy } from "./progression-signal.strategy";
import { RirBelowTarget } from "./rir-below-target";

type Config = { prescription: VO.ExercisePrescriptionType; rir: VO.RirType | undefined };

export class ProgressionSignalRirBelowTargetStrategy implements ProgressionSignalStrategy {
  readonly blocksProgress = true;

  constructor(private readonly config: Config) {}

  calculate(): VO.ProgressionSignalOptions | undefined {
    const { prescription, rir } = this.config;
    const rirBelowTarget = new RirBelowTarget({ target: prescription.rir, rir }).calculate();

    if (!rirBelowTarget) return undefined;

    return VO.ProgressionSignalOptions.rir_below_target;
  }
}
