import type { ExerciseTargetType } from "./exercise-target";
import type { ProgressionSignalOptions } from "./progression-signal-options";

export type ExerciseTargetProgression = {
  last: ExerciseTargetType;
  regress?: ExerciseTargetType;
  progress?: ExerciseTargetType;
  signal?: ProgressionSignalOptions;
};
