import type * as bg from "@bgord/ui";
import { ExerciseLateralityOptions } from "../../modules/exercises/value-objects/exercise-laterality-options";

type LateralityFormatStrategy = {
  suffix: (t: bg.TranslateType) => string | null;
  report: () => string;
};

export const LateralityFormat = {
  [ExerciseLateralityOptions.bilateral]: {
    suffix: () => null,
    report: () => "both",
  },
  [ExerciseLateralityOptions.unilateral]: {
    suffix: (t) => t("exercise.laterality.per_side"),
    report: () => "each",
  },
} satisfies Record<ExerciseLateralityOptions, LateralityFormatStrategy>;
