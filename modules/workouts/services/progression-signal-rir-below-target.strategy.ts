import * as VO from "+workouts/value-objects";
import type { ProgressionSignalStrategy } from "./progression-signal.strategy";
import { RirBelowTarget } from "./rir-below-target";

type Config = { prescription: VO.ExercisePrescriptionType; rir: VO.RirType | undefined };

export class ProgressionSignalRirBelowTargetStrategy implements ProgressionSignalStrategy {
  constructor(private readonly config: Config) {}

  calculate(): VO.ProgressionHoldReasonOptions | undefined {
    const { prescription, rir } = this.config;
    const rirBelowTarget = new RirBelowTarget({ target: prescription.rir, rir }).calculate();

    if (!rirBelowTarget) return undefined;

    return VO.ProgressionHoldReasonOptions.rir_below_target;
  }
}
