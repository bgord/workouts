import * as bg from "@bgord/ui";
import type { ExerciseLoadingOptions } from "../../modules/exercises/value-objects/exercise-loading-options";
import { LoadingFormat } from "../kits/loading.format";

export function TargetValue(props: {
  loading: ExerciseLoadingOptions;
  sets: number;
  reps: number;
  load: number;
}) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  return (
    <span>
      {LoadingFormat[props.loading].setsRepsLoad(t, language, {
        sets: props.sets,
        reps: String(props.reps),
        load: props.load,
      })}
    </span>
  );
}
