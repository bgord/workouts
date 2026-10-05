import type * as VO from "+workouts/value-objects";
import type { ProgressionMethodStrategy } from "./progression-method.strategy";

type Config = { last: VO.ExerciseTargetType };

export class ProgressionMethodNoneStrategy implements ProgressionMethodStrategy {
  constructor(private readonly config: Config) {}

  calculate(): VO.ExerciseTargetProgression {
    return { last: this.config.last };
  }
}
