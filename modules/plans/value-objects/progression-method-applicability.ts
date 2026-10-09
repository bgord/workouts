import type * as Exercises from "+exercises";
import { ProgressionMethodOptions } from "./progression-method-options";

export class ProgressionMethodApplicability {
  private static readonly applicable: Record<
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

  static options(
    resistance: Exercises.VO.ExerciseResistanceOptions,
  ): ReadonlyArray<ProgressionMethodOptions> {
    return ProgressionMethodApplicability.applicable[resistance];
  }

  static isApplicable(
    resistance: Exercises.VO.ExerciseResistanceOptions,
    progression: ProgressionMethodOptions,
  ): boolean {
    return ProgressionMethodApplicability.applicable[resistance].includes(progression);
  }
}
