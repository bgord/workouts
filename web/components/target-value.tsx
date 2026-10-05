import * as bg from "@bgord/ui";
import type { ExerciseLoadingOptions } from "../../modules/exercises/value-objects/exercise-loading-options";
import { SetNotation } from "../services/set-notation";

export function TargetValue(props: {
  loading: ExerciseLoadingOptions;
  sets: number;
  reps: number;
  load: number;
}) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  return <span>{SetNotation.target(t, language, props)}</span>;
}
