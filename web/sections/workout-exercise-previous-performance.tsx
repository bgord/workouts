import * as bg from "@bgord/ui";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import * as ui from "../components";

export function WorkoutExercisePreviousPerformance(props: WorkoutExercise) {
  const t = bg.useTranslations();
  const previous = props.previousPerformance;

  if (!previous) return null;

  return (
    <small
      aria-label={t("workout.previous_performance.title")}
      data-stack="x"
      data-wrap="wrap"
      role="note"
      title={t("workout.previous_performance.title")}
      {...ui.Gap.cluster}
    >
      {previous.diff ? (
        <ui.TargetDiffPills diff={previous.diff} />
      ) : (
        <>
          <ui.SetDots sets={previous.sets} target={previous.sets.length} />
          <ui.PerformanceValue
            data-color="neutral-400"
            data-fw="medium"
            resistance={props.resistance}
            sets={previous.sets}
          />
        </>
      )}

      <ui.DateTime format="freshness" value={previous.scheduledFor} />
    </small>
  );
}
