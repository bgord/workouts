import type { ExerciseTargetType } from "./exercise-target";

export type ExerciseTargetProgression = {
  last: ExerciseTargetType;
  regress?: ExerciseTargetType;
  progress?: ExerciseTargetType;
};
