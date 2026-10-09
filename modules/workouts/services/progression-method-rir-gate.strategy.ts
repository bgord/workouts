import * as VO from "+workouts/value-objects";
import type { ProgressionMethodStrategy } from "./progression-method.strategy";
import { RirBelowTarget } from "./rir-below-target";

type Config = { prescription: VO.ExercisePrescriptionType; rir: VO.RirType | undefined };

type Dependencies = { ProgressionMethod: ProgressionMethodStrategy };

export class ProgressionMethodRirGateStrategy implements ProgressionMethodStrategy {
  constructor(
    private readonly config: Config,
    private readonly deps: Dependencies,
  ) {}

  calculate(): VO.ExerciseTargetProgression {
    const { progress, ...progression } = this.deps.ProgressionMethod.calculate();
    const { prescription, rir } = this.config;
    const rirBelowTarget = new RirBelowTarget({ target: prescription.rir, rir }).calculate();

    if (progress === undefined) return progression;
    if (!rirBelowTarget) return { ...progression, progress };

    return { ...progression, hold: VO.ProgressionHoldReasonOptions.rir_below_target };
  }
}
