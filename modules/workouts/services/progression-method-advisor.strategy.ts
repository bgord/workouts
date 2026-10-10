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
    const applicable = this.deps.ProgressionSignals.filter(
      (signal) => progress !== undefined || !signal.blocksProgress,
    );
    const hits = applicable.filter((signal) => signal.calculate() !== undefined);
    const signal = hits[0]?.calculate();

    if (hits.some((hit) => hit.blocksProgress)) return { ...progression, signal };

    return { ...progression, progress, signal };
  }
}
