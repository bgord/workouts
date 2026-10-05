import * as bg from "@bgord/ui";
import type { ExerciseResistanceOptions } from "../../modules/exercises/value-objects/exercise-resistance-options";
import { SetNotation } from "../services/set-notation";

export function TargetValue(props: {
  resistance: ExerciseResistanceOptions;
  sets: number;
  reps: number;
  load: number;
}) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  return <span>{SetNotation.target(t, language, props)}</span>;
}
