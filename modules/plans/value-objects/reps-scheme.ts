import { ProgressionMethodOptions } from "./progression-method-options";
import type { RepsRangeType } from "./reps-range";
import { RepsSchemeOptions } from "./reps-scheme-options";

export class RepsScheme {
  private static readonly progressions: Record<RepsSchemeOptions, ReadonlyArray<ProgressionMethodOptions>> = {
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

  private static readonly rir: Record<RepsSchemeOptions, boolean> = { range: true, amrap: false };

  static of(reps: Pick<RepsRangeType, "max">): RepsSchemeOptions {
    return reps.max === undefined ? RepsSchemeOptions.amrap : RepsSchemeOptions.range;
  }

  static allowsProgression(scheme: RepsSchemeOptions, progression: ProgressionMethodOptions): boolean {
    return RepsScheme.progressions[scheme].includes(progression);
  }

  static allowsRir(scheme: RepsSchemeOptions): boolean {
    return RepsScheme.rir[scheme];
  }
}
