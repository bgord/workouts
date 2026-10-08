import * as VO from "+workouts/value-objects";
import type { ProgressionMethodStrategy } from "./progression-method.strategy";
import { RirBelowTarget } from "./rir-below-target";

type Config = { prescription: VO.ExercisePrescriptionType; effort: VO.RirType | undefined };

type Dependencies = { ProgressionMethod: ProgressionMethodStrategy };

export class ProgressionMethodEffortGateStrategy implements ProgressionMethodStrategy {
  constructor(
    private readonly config: Config,
    private readonly deps: Dependencies,
  ) {}

  calculate(): VO.ExerciseTargetProgression {
    const { progress, ...progression } = this.deps.ProgressionMethod.calculate();
    const { prescription, effort } = this.config;
    const rirBelowTarget = new RirBelowTarget({ target: prescription.rir, effort }).calculate();

    if (progress === undefined) return progression;
    if (!rirBelowTarget) return { ...progression, progress };

    return { ...progression, hold: VO.ProgressionHoldReasonOptions.rir_below_target };
  }
}
