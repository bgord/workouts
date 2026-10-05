import * as bg from "@bgord/ui";
import type { ExerciseLoadingOptions } from "../../modules/exercises/value-objects/exercise-loading-options";
import { SetNotation } from "../services/set-notation";

export function SetValue(props: { loading: ExerciseLoadingOptions; reps: number; load: number }) {
  const language = bg.useLanguage();

  return <span>{SetNotation.set(language, props)}</span>;
}
