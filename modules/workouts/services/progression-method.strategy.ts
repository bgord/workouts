import type * as VO from "+workouts/value-objects";

export interface ProgressionMethodStrategy {
  calculate(): VO.ExerciseTargetProgression;
}
