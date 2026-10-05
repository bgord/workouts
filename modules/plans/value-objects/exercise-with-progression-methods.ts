import type * as Exercises from "+exercises";
import type { ProgressionMethodOptions } from "./progression-method-options";

export type ExerciseWithProgressionMethods = Exercises.VO.Exercise & {
  progressionMethods: ReadonlyArray<ProgressionMethodOptions>;
};
