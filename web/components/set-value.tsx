import * as bg from "@bgord/ui";
import type { ExerciseLateralityOptions } from "../../modules/exercises/value-objects/exercise-laterality-options";
import type { ExerciseResistanceOptions } from "../../modules/exercises/value-objects/exercise-resistance-options";
import { SetNotation } from "../services/set-notation";

export function SetValue(
  props: React.JSX.IntrinsicElements["span"] & {
    resistance: ExerciseResistanceOptions;
    laterality: ExerciseLateralityOptions;
    reps: number;
    load: number;
  },
) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const { resistance, laterality, reps, load, ...span } = props;

  return <span {...span}>{SetNotation.set(t, language, { resistance, laterality, reps, load })}</span>;
}
