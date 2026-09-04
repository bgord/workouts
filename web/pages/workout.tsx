// fallow-ignore-file unused-export
import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import { WorkoutExerciseLimitMax } from "../../modules/workouts/value-objects/workout-exercise-limit";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";
import { Main, WorkoutExerciseRow, WorkoutStatusBadge } from "../components";
import { workoutRoute } from "../router";
import { WorkoutAbandon } from "../sections/workout-abandon";
import { WorkoutComplete } from "../sections/workout-complete";
import { WorkoutDiscard } from "../sections/workout-discard";
import { WorkoutExerciseAdd } from "../sections/workout-exercise-add";
import { WorkoutExerciseRemove } from "../sections/workout-exercise-remove";
import { WorkoutExerciseTargetSet } from "../sections/workout-exercise-target-set";
import { WorkoutSetList } from "../sections/workout-set-list";
import { WorkoutSetLog } from "../sections/workout-set-log";
import { WorkoutStart } from "../sections/workout-start";

export function Workout() {
  const t = useTranslations();
  const language = useLanguage();
  const { workout } = workoutRoute.useLoaderData();

  const title = workout
    ? t("workout.title", { plan: workout.planName, section: workout.planSectionName })
    : "";

  return (
    <Main>
      <Link className="c-link" search={WorkoutHistoryFilters.default} to="/">
        {`< ${t("app.back")}`}
      </Link>

      {!workout && <div data-color="neutral-500">{t("workout.not_found")}</div>}

      {workout && (
        <div data-cross="center" data-gap="3" data-main="between" data-stack="x">
          <h1 data-fs="lg" data-maxw="100%" data-transform="truncate" title={title}>
            {title}
          </h1>

          <WorkoutStatusBadge data-mt="auto" status={workout.status} />
        </div>
      )}

      {workout && (
        <div data-color="neutral-500" data-fs="sm">
          {Temporal.PlainDate.from(workout.scheduledFor).toLocaleString(language, {
            day: "numeric",
            month: "short",
            weekday: "short",
            year: "numeric",
          })}
        </div>
      )}

      {workout && workout.status === WorkoutStatusEnum.draft && (
        <div data-cross="center" data-gap="3" data-stack="x">
          <WorkoutStart workout={workout} />

          <WorkoutDiscard workout={workout} />
        </div>
      )}

      {workout && workout.status === WorkoutStatusEnum.in_progress && (
        <div data-cross="center" data-gap="3" data-stack="x">
          <WorkoutComplete workout={workout} />

          <WorkoutAbandon workout={workout} />
        </div>
      )}

      {workout && (
        <ul data-gap="3" data-stack="y">
          {workout.exercises.map((exercise) => (
            <WorkoutExerciseRow exercise={exercise} key={exercise.id}>
              <WorkoutSetList exercise={exercise} workout={workout} />

              {workout.status === WorkoutStatusEnum.draft && (
                <div data-cross="end" data-gap="3" data-stack="x">
                  <WorkoutExerciseTargetSet exercise={exercise} workout={workout} />

                  <WorkoutExerciseRemove exercise={exercise} workout={workout} />
                </div>
              )}

              {workout.status === WorkoutStatusEnum.in_progress && (
                <WorkoutSetLog exercise={exercise} workout={workout} />
              )}
            </WorkoutExerciseRow>
          ))}
        </ul>
      )}

      {workout &&
        workout.status === WorkoutStatusEnum.draft &&
        workout.exercises.length < WorkoutExerciseLimitMax && <WorkoutExerciseAdd workout={workout} />}
    </Main>
  );
}
