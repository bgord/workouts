import type * as Exercises from "+exercises";
import { ProgressionMethodOptions } from "./progression-method-options";

export const ProgressionMethodApplicability: Record<
  Exercises.VO.ExerciseResistanceOptions,
  ReadonlyArray<ProgressionMethodOptions>
> = {
  weighted: [
    ProgressionMethodOptions.double_progression,
    ProgressionMethodOptions.linear_progression,
    ProgressionMethodOptions.rep_progression,
    ProgressionMethodOptions.none,
  ],
  bodyweight: [
    ProgressionMethodOptions.double_progression,
    ProgressionMethodOptions.rep_progression,
    ProgressionMethodOptions.none,
  ],
};
