// fallow-ignore-file unused-export
import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";
import { Main, WorkoutExerciseRow, WorkoutStatusBadge } from "../components";
import { workoutRoute } from "../router";
import { WorkoutAbandon } from "../sections/workout-abandon";
import { WorkoutDiscard } from "../sections/workout-discard";
import { WorkoutExerciseTargetSet } from "../sections/workout-exercise-target-set";
import { WorkoutStart } from "../sections/workout-start";

export function Workout() {
  const t = useTranslations();
  const language = useLanguage();
  const { workout } = workoutRoute.useLoaderData();

  return (
    <Main>
      <Link className="c-link" to="/">
        {`< ${t("app.back")}`}
      </Link>

      {!workout && <div data-color="neutral-500">{t("workout.not_found")}</div>}

      {workout && (
        <div data-cross="center" data-gap="3" data-stack="x">
          <h1 data-fs="lg" data-maxw="100%" data-transform="truncate" title={workout.planName}>
            {workout.planName}
          </h1>

          <WorkoutStatusBadge status={workout.status} />
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
        <WorkoutAbandon workout={workout} />
      )}

      {workout && (
        <ul data-gap="3" data-stack="y">
          {workout.exercises.map((exercise) => (
            <WorkoutExerciseRow exercise={exercise} key={exercise.id}>
              {workout.status === WorkoutStatusEnum.draft && (
                <WorkoutExerciseTargetSet exercise={exercise} workout={workout} />
              )}
            </WorkoutExerciseRow>
          ))}
        </ul>
      )}
    </Main>
  );
}
