import * as VO from "+workouts/value-objects";
import type { ProgressionMethodStrategy } from "./progression-method.strategy";

type Config = { prescription: VO.ExercisePrescriptionType; effort: VO.RirType | undefined };

type Dependencies = { ProgressionMethod: ProgressionMethodStrategy };

export class ProgressionMethodEffortGateStrategy implements ProgressionMethodStrategy {
  constructor(
    private readonly config: Config,
    private readonly deps: Dependencies,
  ) {}

  calculate(): VO.ExerciseTargetProgression {
    const { progress, ...progression } = this.deps.ProgressionMethod.calculate();

    if (progress === undefined) return progression;
    if (!this.belowTarget()) return { ...progression, progress };

    return { ...progression, hold: VO.ProgressionHoldReasonOptions.rir_below_target };
  }

  private belowTarget(): boolean {
    const { prescription, effort } = this.config;

    if (prescription.rir === undefined || effort === undefined) return false;

    return effort < prescription.rir;
  }
}
