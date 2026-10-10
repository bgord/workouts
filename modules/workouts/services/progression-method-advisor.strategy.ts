import type * as VO from "+workouts/value-objects";
import type { ProgressionMethodStrategy } from "./progression-method.strategy";
import type { ProgressionSignalStrategy } from "./progression-signal.strategy";

type Dependencies = {
  ProgressionMethod: ProgressionMethodStrategy;
  ProgressionSignals: ReadonlyArray<ProgressionSignalStrategy>;
};

export class ProgressionMethodAdvisorStrategy implements ProgressionMethodStrategy {
  constructor(private readonly deps: Dependencies) {}

  calculate(): VO.ExerciseTargetProgression {
    const { progress, ...progression } = this.deps.ProgressionMethod.calculate();

    if (progress === undefined) return progression;

    const hold = this.deps.ProgressionSignals.map((signal) => signal.calculate()).find(
      (reason) => reason !== undefined,
    );

    if (hold === undefined) return { ...progression, progress };

    return { ...progression, hold };
  }
}
