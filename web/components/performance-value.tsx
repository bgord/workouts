import * as bg from "@bgord/ui";
import type { ExerciseResistanceOptions } from "../../modules/exercises/value-objects/exercise-resistance-options";
import type { ExercisePerformance } from "../../modules/workouts/queries/list-exercise-performances";
import { SetNotation } from "../services/set-notation";

export function PerformanceValue(
  props: { resistance: ExerciseResistanceOptions } & Pick<ExercisePerformance, "sets">,
) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  return <span>{SetNotation.performance(t, language, props)}</span>;
}
