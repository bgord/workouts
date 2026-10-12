import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { CircleCheck, CircleDashed } from "lucide-react";
import { Fragment } from "react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import * as ui from "../components";

export function WorkoutExerciseRecentPerformances(
  props: { exercise: WorkoutExercise } & bg.UseToggleReturnType,
) {
  const t = bg.useTranslations();
  const { toggle } = bg.extractUseToggle(props);
  const { exercise } = props;
  const performances = [...exercise.recentPerformances].reverse();
  const title = t("workout.recent_performances.title", { sessions: exercise.recentPerformances.length });

  if (toggle.off || exercise.recentPerformances.length < 2) return null;

  return (
    <small
      aria-label={title}
      data-md-cross="stretch"
      data-md-ml="1"
      data-md-pl="8"
      data-md-stack="y"
      data-pl="12"
      data-stack="x"
      data-wrap="wrap"
      role="note"
      title={title}
      {...ui.Gap.cluster}
      {...toggle.props.target}
    >
      {performances.map((performance, index) => (
        <Fragment key={performance.workoutId}>
          {index > 0 && (
            <span aria-hidden="true" data-color="neutral-600" data-md-disp="none">
              ›
            </span>
          )}

          <Link
            data-hover-color="brand-300"
            data-stack="x"
            params={{ workoutId: performance.workoutId }}
            to="/workouts/$workoutId"
            {...ui.Gap.related}
          >
            {performance.missed ? (
              <CircleDashed
                aria-label={t("workout.recent_performances.missed")}
                data-color="neutral-600"
                data-shrink="0"
                data-size="xs"
              />
            ) : (
              <CircleCheck
                aria-label={t("workout.recent_performances.hit")}
                data-color="positive-400"
                data-shrink="0"
                data-size="xs"
              />
            )}

            <bg.DateTime data-color="neutral-600" format="short" value={performance.scheduledFor} />

            {performance.sets.length === 0 ? (
              <span data-color="neutral-400">{t("workout.recent_performances.skipped")}</span>
            ) : (
              <ui.PerformanceValue
                data-color="neutral-400"
                laterality={exercise.laterality}
                resistance={exercise.resistance}
                sets={performance.sets}
              />
            )}
          </Link>
        </Fragment>
      ))}
    </small>
  );
}
