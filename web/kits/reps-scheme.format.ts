import type { RepsRangeType } from "../../modules/plans/value-objects/reps-range";
import { RepsSchemeOptions } from "../../modules/plans/value-objects/reps-scheme-options";

type RepsSchemeFormatStrategy = {
  prescription: (reps: Pick<RepsRangeType, "min" | "max">) => string;
  target: (reps: number) => string;
  targetField: { label: string; unit: string | undefined };
};

export const RepsSchemeFormat = {
  [RepsSchemeOptions.range]: {
    prescription: (reps) => (reps.min === reps.max ? String(reps.min) : `${reps.min}-${reps.max}`),
    target: (reps) => String(reps),
    targetField: { label: "workout.target.reps.label", unit: undefined },
  },
  [RepsSchemeOptions.amrap]: {
    prescription: (reps) => `${reps.min}+`,
    target: (reps) => `${reps}+`,
    targetField: { label: "workout.target.reps.amrap.label", unit: "+" },
  },
} satisfies Record<RepsSchemeOptions, RepsSchemeFormatStrategy>;
