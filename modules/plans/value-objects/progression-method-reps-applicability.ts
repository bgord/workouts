import { ProgressionMethodOptions } from "./progression-method-options";
import type { RepsSchemeOptions } from "./reps-scheme-options";

export const ProgressionMethodRepsApplicability: Record<
  RepsSchemeOptions,
  ReadonlyArray<ProgressionMethodOptions>
> = {
  range: [
    ProgressionMethodOptions.double_progression,
    ProgressionMethodOptions.linear_progression,
    ProgressionMethodOptions.rep_progression,
    ProgressionMethodOptions.none,
  ],
  amrap: [
    ProgressionMethodOptions.linear_progression,
    ProgressionMethodOptions.rep_progression,
    ProgressionMethodOptions.none,
  ],
};
