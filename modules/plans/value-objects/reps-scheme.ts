import type { RepsRangeType } from "./reps-range";
import { RepsSchemeOptions } from "./reps-scheme-options";

export const RepsScheme = {
  of: (reps: Pick<RepsRangeType, "max">): RepsSchemeOptions =>
    reps.max === undefined ? RepsSchemeOptions.amrap : RepsSchemeOptions.range,
};
