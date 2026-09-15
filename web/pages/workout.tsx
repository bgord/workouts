// fallow-ignore-file unused-export
/* cSpell:disable */
import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, Dumbbell } from "lucide-react";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";
import { ActionHint, Main, WorkoutStatusBadge } from "../components";
import { workoutRoute } from "../router";
import { WorkoutComplete } from "../sections/workout-complete";
import { WorkoutCopy } from "../sections/workout-copy";
import { WorkoutDiscard } from "../sections/workout-discard";
import { WorkoutExerciseAdd } from "../sections/workout-exercise-add";
import { WorkoutExerciseRow } from "../sections/workout-exercise-row";
import { WorkoutNote } from "../sections/workout-note";
import { WorkoutReschedule } from "../sections/workout-reschedule";
import { WorkoutStart } from "../sections/workout-start";
import { DateFormat } from "../services/date-format";

const title = { flexBasis: 0, minWidth: 0 };
const secondary = { marginLeft: "auto" };

export function Workout() {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
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
          search={search}
          to="/workouts"
        >
          <ChevronLeft data-size="sm" />
          {t("app.back")}
        </Link>

        <div data-color="neutral-400">{t("workout.not_found")}</div>
      </Main>
    );
  }

  const primary = workout.actions.start.available || workout.actions.complete.available;

  return (
    <Main>
      <div data-gap="3" data-stack="y">
        <div data-cross="center" data-gap="1" data-md-wrap="wrap" data-stack="x" data-wrap="nowrap">
          <Link
            aria-label={t("app.back")}
            className="c-button"
            data-interaction="subtle-scale"
            data-self="start"
            data-shrink="0"
            data-variant="icon"
            search={search}
            title={t("app.back")}
            to="/workouts"
          >
            <ChevronLeft data-size="md" />
          </Link>

          <div data-cross="center" data-gap="3" data-grow="1" data-stack="x" data-wrap="nowrap" style={title}>
            <h1
              data-color={workout.data.status === WorkoutStatusEnum.discarded ? "neutral-300" : "neutral-0"}
              data-fs="2xl"
              data-fw="black"
              data-md-fs="xl"
              data-transform="truncate"
            >
              {t("workout.title", { plan: workout.data.planName, section: workout.data.planSectionName })}
            </h1>

            <div data-cross="center" data-self="start" data-stack="x" {...bg.Rhythm().times(3).style.height}>
              <WorkoutStatusBadge status={workout.data.status} />
            </div>
          </div>

          <div
            data-cross="center"
            data-gap="2"
            data-md-mt={primary ? "1" : undefined}
            data-md-width={primary ? "100%" : undefined}
            data-shrink="0"
            data-stack="x"
            data-wrap="nowrap"
          >
            {workout.actions.start.available && (
              <WorkoutStart action={workout.actions.start} {...workout.data} />
            )}

            {workout.actions.complete.available && (
              <WorkoutComplete action={workout.actions.complete} {...workout.data} />
            )}

            <div data-cross="center" data-stack="x" data-wrap="nowrap" style={secondary}>
              {workout.data.completedAt && (
                <WorkoutCopy {...workout.data} completedAt={workout.data.completedAt} />
              )}

              {workout.actions.discard.available && <WorkoutDiscard {...workout.data} />}
            </div>
          </div>
        </div>

        <div data-gap="3" data-md-pl="0" data-pl="12" data-stack="y">
          {workout.actions.reschedule.available ? (
            <WorkoutReschedule action={workout.actions.reschedule} {...workout.data} />
          ) : (
            <div data-color="neutral-500" data-fs="xs">
              {DateFormat.dayWithWeekday(language, Temporal.PlainDate.from(workout.data.scheduledFor))}
            </div>
          )}

          {workout.actions.noteSet.available && (
            <WorkoutNote action={workout.actions.noteSet} {...workout.data} />
          )}

          {workout.actions.start.available && <ActionHint action={workout.actions.start} />}

          {workout.actions.complete.available && <ActionHint action={workout.actions.complete} />}
        </div>
      </div>

      <div data-gap="3" data-stack="y">
        {workout.actions.exerciseAdd.available && (
          <div data-main="end" data-stack="x">
            <WorkoutExerciseAdd action={workout.actions.exerciseAdd} {...workout.data} />
          </div>
        )}

        {workout.data.exercises.length === 0 && (
          <div
            className="c-card"
            data-cross="center"
            data-gap="1"
            data-py="8"
            data-stack="y"
            data-variant="flat"
          >
            <Dumbbell data-color="neutral-600" data-size="md" />

            <div data-color="neutral-300" data-fs="sm" data-mt="2">
              {t("workout.exercise.list.empty")}
            </div>

            <div data-color="neutral-500" data-fs="xs">
              {t("workout.exercise.list.empty.hint")}
            </div>
          </div>
        )}

        <ul data-stack="y">
          {workout.data.exercises.map((exercise, index) => (
            <WorkoutExerciseRow
              exercise={exercise}
              index={index}
              key={exercise.id}
              last={index === workout.data.exercises.length - 1}
              workout={workout.data}
            />
          ))}
        </ul>
      </div>
    </Main>
  );
}
