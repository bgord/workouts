import * as bg from "@bgord/ui";
import type { ExerciseLateralityOptions } from "../../modules/exercises/value-objects/exercise-laterality-options";
import type { ExerciseResistanceOptions } from "../../modules/exercises/value-objects/exercise-resistance-options";
import type { ExercisePerformance } from "../../modules/workouts/queries/list-exercise-performances";
import { SetNotation } from "../services/set-notation";

export function PerformanceValue(
  props: React.JSX.IntrinsicElements["span"] & {
    resistance: ExerciseResistanceOptions;
    laterality: ExerciseLateralityOptions;
  } & Pick<ExercisePerformance, "sets">,
) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const { resistance, laterality, sets, ...span } = props;

  return <span {...span}>{SetNotation.performance(t, language, { resistance, laterality, sets })}</span>;
}
