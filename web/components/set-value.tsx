import * as bg from "@bgord/ui";
import type { ExerciseResistanceOptions } from "../../modules/exercises/value-objects/exercise-resistance-options";
import { SetNotation } from "../services/set-notation";

export function SetValue(
  props: React.JSX.IntrinsicElements["span"] & {
    resistance: ExerciseResistanceOptions;
    reps: number;
    load: number;
  },
) {
  const language = bg.useLanguage();
  const { resistance, reps, load, ...span } = props;

  return <span {...span}>{SetNotation.set(language, { resistance, reps, load })}</span>;
}
