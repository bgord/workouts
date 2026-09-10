// fallow-ignore-file unused-export
/* cSpell:disable */
import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Main, WorkoutStatusBadge } from "../components";
import { workoutRoute } from "../router";
import { WorkoutComplete } from "../sections/workout-complete";
import { WorkoutDiscard } from "../sections/workout-discard";
import { WorkoutExerciseAdd } from "../sections/workout-exercise-add";
import { WorkoutExerciseRow } from "../sections/workout-exercise-row";
import { WorkoutNote } from "../sections/workout-note";
import { WorkoutReschedule } from "../sections/workout-reschedule";
import { WorkoutStart } from "../sections/workout-start";
import { DateFormat } from "../services/date-format";

export function Workout() {
  const t = useTranslations();
  const language = useLanguage();
  const { workout } = workoutRoute.useLoaderData();
  const search = workoutRoute.useSearch();

  if (!workout) {
    return (
      <Main>
        <Link
          className="c-link"
          data-cross="center"
          data-gap="1"
          data-stack="x"
          search={{ section: search.section }}
          to="/workouts"
        >
          <ChevronLeft data-size="sm" />
          {t("app.back")}
        </Link>

        <div data-color="neutral-400">{t("workout.not_found")}</div>
      </Main>
    );
  }

  return (
    <Main>
      <div data-gap="4" data-stack="y">
        <div data-cross="center" data-gap="2" data-stack="x">
          <Link
            aria-label={t("app.back")}
            className="c-button"
            data-interaction="subtle-scale"
            data-self="start"
            data-variant="icon"
            search={{ section: search.section }}
            title={t("app.back")}
            to="/workouts"
          >
            <ChevronLeft data-size="md" />
          </Link>

          <div data-gap="0-5" data-grow="1" data-stack="y" data-transform="truncate">
            <h1
              data-color="neutral-0"
              data-fs="2xl"
              data-fw="black"
              data-md-fs="xl"
              data-transform="truncate"
            >
              {t("workout.title", { plan: workout.data.planName, section: workout.data.planSectionName })}
            </h1>

            {workout.actions.reschedule.available ? (
              <WorkoutReschedule action={workout.actions.reschedule} {...workout.data} />
            ) : (
              <div data-color="neutral-500" data-fs="xs">
                {DateFormat.dayWithWeekday(language, Temporal.PlainDate.from(workout.data.scheduledFor))}
              </div>
            )}
          </div>

          <WorkoutStatusBadge status={workout.data.status} />
        </div>

        <div data-cross="center" data-gap="2" data-stack="x" data-wrap="wrap">
          <div data-cross="center" data-gap="2" data-grow="1" data-stack="x" data-wrap="wrap">
            {workout.actions.start.available && (
              <WorkoutStart action={workout.actions.start} {...workout.data} />
            )}
            {workout.actions.complete.available && (
              <WorkoutComplete action={workout.actions.complete} {...workout.data} />
            )}

            {workout.data.completedAt && (
              <div data-color="neutral-500" data-fs="sm">
                {t("workout.completed_at", {
                  date: DateFormat.dayWithTime(language, DateFormat.zoned(workout.data.completedAt)),
                })}
              </div>
            )}
          </div>

          {workout.actions.discard.available && <WorkoutDiscard {...workout.data} />}
        </div>

        {workout.actions.noteSet.available && (
          <WorkoutNote action={workout.actions.noteSet} {...workout.data} />
        )}
      </div>

      <ul data-gap="3" data-stack="y">
        {workout.data.exercises.map((exercise, position) => (
          <WorkoutExerciseRow
            exercise={exercise}
            key={exercise.id}
            position={position + 1}
            workout={workout.data}
          />
        ))}
      </ul>

      {workout.actions.exerciseAdd.available && (
        <WorkoutExerciseAdd action={workout.actions.exerciseAdd} {...workout.data} />
      )}
    </Main>
  );
}
