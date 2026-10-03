import * as bg from "@bgord/ui";
import type { ExerciseLoadingOptions } from "../../modules/exercises/value-objects/exercise-loading-options";
import { LoadingFormat } from "../kits/loading.format";

export function SetValue(props: { loading: ExerciseLoadingOptions; reps: number; load: number }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  return (
    <span>
      {LoadingFormat[props.loading].repsLoad(t, language, { reps: String(props.reps), load: props.load })}
    </span>
  );
}
