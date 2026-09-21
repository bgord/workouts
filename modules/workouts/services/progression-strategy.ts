import type * as VO from "+workouts/value-objects";

export interface ProgressionStrategy {
  calculate(): VO.ExerciseTargetProgression;
}
