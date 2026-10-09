import type * as Plans from "+plans";
import * as VO from "+workouts/value-objects";
import type { ProgressionMethodStrategy } from "./progression-method.strategy";

type Config = { prescription: VO.ExercisePrescriptionType; sets: Plans.VO.SetsType };

type Dependencies = { ProgressionMethod: ProgressionMethodStrategy };

export class ProgressionMethodSetsGateStrategy implements ProgressionMethodStrategy {
  constructor(
    private readonly config: Config,
    private readonly deps: Dependencies,
  ) {}

  calculate(): VO.ExerciseTargetProgression {
    const { progress, ...progression } = this.deps.ProgressionMethod.calculate();
    const { prescription, sets } = this.config;
    const setsBelowTarget = sets < prescription.sets;

    if (progress === undefined) return progression;
    if (!setsBelowTarget) return { ...progression, progress };

    return { ...progression, hold: VO.ProgressionHoldReasonOptions.sets_below_target };
  }
}
