import type * as Exercises from "+exercises";
import { ProgressionMethodOptions } from "./progression-method-options";

export const ProgressionMethodApplicability: Record<
  Exercises.VO.ExerciseResistanceOptions,
  ReadonlyArray<ProgressionMethodOptions>
> = {
  weighted: [
    ProgressionMethodOptions.double_progression,
    ProgressionMethodOptions.linear_progression,
    ProgressionMethodOptions.none,
  ],
  bodyweight: [ProgressionMethodOptions.double_progression, ProgressionMethodOptions.none],
};

export const applicableProgressionMethod = (
  resistance: Exercises.VO.ExerciseResistanceOptions,
  current: ProgressionMethodOptions | undefined,
): ProgressionMethodOptions =>
  current && ProgressionMethodApplicability[resistance].includes(current)
    ? current
    : ProgressionMethodOptions.double_progression;
