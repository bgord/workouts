// fallow-ignore-file unused-export
import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
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

const FINISHED = [WorkoutStatusEnum.completed, WorkoutStatusEnum.abandoned];

export function Workout() {
  const t = useTranslations();
  const language = useLanguage();
  const { workout } = workoutRoute.useLoaderData();
  const search = workoutRoute.useSearch();

  const title = workout
    ? t("workout.title", { plan: workout.planName, section: workout.planSectionName })
    : "";

  return (
    <Main>
      <Link className="c-link" search={{ section: search.section }} to="/">
        {`< ${t("app.back")}`}
      </Link>

      {!workout && <div data-color="neutral-500">{t("workout.not_found")}</div>}

      {workout && (
        <div data-gap="4" data-stack="y">
          <div data-cross="center" data-gap="3" data-main="between" data-stack="x">
            <div data-gap="1" data-grow="1" data-stack="y" style={{ minInlineSize: 0 }}>
              <h1
                data-color="neutral-0"
                data-fs="2xl"
                data-fw="black"
                data-md-fs="xl"
                data-transform="truncate"
                title={title}
              >
                {title}
              </h1>

              <div data-color="neutral-400" data-fs="sm">
                {Temporal.PlainDate.from(workout.scheduledFor).toLocaleString(language, {
                  day: "numeric",
                  month: "short",
                  weekday: "short",
                  year: "numeric",
                })}
              </div>
            </div>

            <WorkoutStatusBadge status={workout.status} />
          </div>

          {workout.status === WorkoutStatusEnum.draft && (
            <div data-cross="center" data-gap="3" data-stack="x">
              <WorkoutStart workout={workout} />

              <WorkoutDiscard workout={workout} />
            </div>
          )}

          {workout.status === WorkoutStatusEnum.in_progress && (
            <div data-cross="center" data-gap="3" data-stack="x">
              <WorkoutComplete workout={workout} />

              <WorkoutAbandon workout={workout} />
            </div>
          )}
        </div>
      )}

      {workout && (
        <ul data-gap="3" data-stack="y">
          {workout.exercises.map((exercise) => (
            <WorkoutExerciseRow
              exercise={exercise}
              key={exercise.id}
              skipped={FINISHED.includes(workout.status) && exercise.loggedSets.length === 0}
            >
              <WorkoutSetList exercise={exercise} workout={workout} />

              {workout.status === WorkoutStatusEnum.draft && (
                <div className="c-card-footer" data-cross="end" data-gap="3">
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
