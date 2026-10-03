import type * as Exercises from "+exercises";
import { ProgressionMethodOptions } from "./progression-method-options";

export const ProgressionMethodApplicability = {
  external: [
    ProgressionMethodOptions.double_progression,
    ProgressionMethodOptions.linear_progression,
    ProgressionMethodOptions.none,
  ],
} satisfies Record<Exercises.VO.ExerciseLoadingOptions, ReadonlyArray<ProgressionMethodOptions>>;
