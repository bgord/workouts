import * as bg from "@bgord/ui";
import type { ExerciseResistanceOptions } from "../../modules/exercises/value-objects/exercise-resistance-options";
import { SetNotation } from "../services/set-notation";

export function TargetValue(
  props: React.JSX.IntrinsicElements["span"] & {
    resistance: ExerciseResistanceOptions;
    sets: number;
    reps: number;
    load: number;
  },
) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const { resistance, sets, reps, load, ...span } = props;

  return <span {...span}>{SetNotation.target(t, language, { resistance, sets, reps, load })}</span>;
}
