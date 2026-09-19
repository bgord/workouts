import * as bg from "@bgord/ui";
import type { ExercisePerformance } from "../../modules/workouts/queries/list-exercise-performances";
import { WeightFormat } from "../services/weight-format";
import { SetsRepsLoad } from "./sets-reps-load";

export function ExercisePerformanceSummary(props: Pick<ExercisePerformance, "sets">) {
  const t = bg.useTranslations();

  const reps = props.sets.map((set) => set.reps);
  const load = Math.min(...props.sets.map((set) => set.load));
  const uniform = reps.every((value) => value === reps[0]);

  if (uniform) return <SetsRepsLoad load={load} reps={reps[0] ?? 0} sets={props.sets.length} />;

  return (
    <span>
      {t("workout.previous_performance.reps_load", {
        reps: reps.join("·"),
        load: WeightFormat.kilograms(load),
      })}
    </span>
  );
}
