// fallow-ignore-file unused-export
/* cSpell:disable */
import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { DateFormat } from "../../app/services/date-format";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";
import { Main, WorkoutExerciseRow, WorkoutStatusBadge } from "../components";
import { workoutRoute } from "../router";
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
  const search = workoutRoute.useSearch();
  const title = workout
    ? t("workout.title", { plan: workout.data.planName, section: workout.data.planSectionName })
    : "";

  return (
    <Main>
      <Link className="c-link" search={{ section: search.section }} to="/">
        {`< ${t("app.back")}`}
      </Link>

      {!workout && <div data-color="neutral-400">{t("workout.not_found")}</div>}

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
                {DateFormat.dayWithWeekday(language, Temporal.PlainDate.from(workout.data.scheduledFor))}
              </div>
            </div>

            <WorkoutStatusBadge status={workout.data.status} />
          </div>

          {workout.actions.discard.enabled && (
            <div data-gap="2" data-stack="y">
              <div data-cross="center" data-gap="3" data-stack="x">
                {workout.actions.start.enabled && <WorkoutStart workout={workout.data} />}

                {workout.actions.complete.enabled && <WorkoutComplete workout={workout.data} />}

                <WorkoutDiscard workout={workout.data} />
              </div>

              {[...workout.actions.start.hints, ...workout.actions.complete.hints].map((blocker) => (
                <div data-color="neutral-400" data-fs="sm" key={blocker}>
                  {t(blocker)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {workout && (
        <ul data-gap="3" data-stack="y">
          {workout.data.exercises.map((exercise) => (
            <WorkoutExerciseRow
              exercise={exercise}
              key={exercise.id}
              skipped={
                workout.data.status === WorkoutStatusEnum.completed && exercise.loggedSets.length === 0
              }
            >
              <WorkoutSetList exercise={exercise} workout={workout.data} />

              {workout.data.status === WorkoutStatusEnum.draft && (
                <div className="c-card-footer" data-cross="end" data-gap="3">
                  <WorkoutExerciseTargetSet exercise={exercise} workout={workout.data} />

                  <WorkoutExerciseRemove exercise={exercise} workout={workout.data} />
                </div>
              )}

              {workout.data.status === WorkoutStatusEnum.in_progress && (
                <WorkoutSetLog exercise={exercise} workout={workout.data} />
              )}
            </WorkoutExerciseRow>
          ))}
        </ul>
      )}

      {workout?.actions.exerciseAdd.enabled && <WorkoutExerciseAdd workout={workout.data} />}

      {workout?.actions.exerciseAdd.hints.map((blocker) => (
        <div data-color="neutral-400" data-fs="sm" key={blocker}>
          {t(blocker)}
        </div>
      ))}
    </Main>
  );
}
