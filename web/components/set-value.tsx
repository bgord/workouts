import * as bg from "@bgord/ui";
import type { ExerciseResistanceOptions } from "../../modules/exercises/value-objects/exercise-resistance-options";
import { SetNotation } from "../services/set-notation";

export function SetValue(props: { resistance: ExerciseResistanceOptions; reps: number; load: number }) {
  const language = bg.useLanguage();

  return <span>{SetNotation.set(language, props)}</span>;
}
