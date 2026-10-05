import * as bg from "@bgord/ui";
import type { ExerciseLoadingOptions } from "../../modules/exercises/value-objects/exercise-loading-options";
import type { ExercisePerformance } from "../../modules/workouts/queries/list-exercise-performances";
import { SetNotation } from "../services/set-notation";

export function PerformanceValue(
  props: { loading: ExerciseLoadingOptions } & Pick<ExercisePerformance, "sets">,
) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  return <span>{SetNotation.performance(t, language, props)}</span>;
}
