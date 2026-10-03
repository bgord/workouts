import type * as Exercises from "+exercises";
import { ProgressionMethodOptions } from "./progression-method-options";

export const ProgressionMethodApplicability: Record<
  Exercises.VO.ExerciseLoadingOptions,
  ReadonlyArray<ProgressionMethodOptions>
> = {
  external: [
    ProgressionMethodOptions.double_progression,
    ProgressionMethodOptions.linear_progression,
    ProgressionMethodOptions.none,
  ],
  none: [ProgressionMethodOptions.double_progression, ProgressionMethodOptions.none],
};

export const applicableProgressionMethod = (
  loading: Exercises.VO.ExerciseLoadingOptions,
  current: ProgressionMethodOptions | undefined,
): ProgressionMethodOptions =>
  current && ProgressionMethodApplicability[loading].includes(current)
    ? current
    : ProgressionMethodOptions.double_progression;
