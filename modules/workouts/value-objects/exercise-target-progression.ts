import type { ExerciseTargetType } from "./exercise-target";
import type { ProgressionHoldReasonOptions } from "./progression-hold-reason-options";

export type ExerciseTargetProgression = {
  last: ExerciseTargetType;
  regress?: ExerciseTargetType;
  progress?: ExerciseTargetType;
  hold?: ProgressionHoldReasonOptions;
};
