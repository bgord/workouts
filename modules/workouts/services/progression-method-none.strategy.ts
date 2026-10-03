import type * as VO from "+workouts/value-objects";
import type { ProgressionMethodStrategy } from "./progression-method.strategy";

export class ProgressionMethodNoneStrategy implements ProgressionMethodStrategy {
  constructor(private readonly last: VO.ExerciseTargetType) {}

  calculate(): VO.ExerciseTargetProgression {
    return { last: this.last };
  }
}
