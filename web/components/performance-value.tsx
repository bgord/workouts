import * as bg from "@bgord/ui";
import type { ExerciseLoadingOptions } from "../../modules/exercises/value-objects/exercise-loading-options";
import type { ExercisePerformance } from "../../modules/workouts/queries/list-exercise-performances";
import { LoadingFormat } from "../kits/loading.format";

export function PerformanceValue(
  props: { loading: ExerciseLoadingOptions } & Pick<ExercisePerformance, "sets">,
) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  const reps = props.sets.map((set) => set.reps);
  const load = Math.min(...props.sets.map((set) => set.load));
  const uniform = reps.every((value) => value === reps[0]);

  if (uniform) {
    return (
      <span>
        {LoadingFormat[props.loading].setsRepsLoad(t, language, {
          sets: props.sets.length,
          reps: String(reps[0] ?? 0),
          load,
        })}
      </span>
    );
  }

  return <span>{LoadingFormat[props.loading].repsLoad(t, language, { reps: reps.join("·"), load })}</span>;
}
