// fallow-ignore-file unused-export
/* cSpell:disable */
import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, Dumbbell, DumbbellIcon } from "lucide-react";
import { WorkoutExerciseLimitMax } from "../../modules/workouts/value-objects/workout-exercise-limit";
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
      <div data-gap="3" data-stack="y">
        <div data-cross="center" data-gap="2" data-stack="x" data-wrap="nowrap">
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

          <div data-gap="0-5" data-grow="1" data-stack="y" {...bg.Rhythm().times(0).style.minWidth}>
            <div data-cross="center" data-gap="2" data-md-wrap="wrap" data-stack="x" data-wrap="nowrap">
              <div data-gap="0-5" data-grow="1" data-stack="y" {...bg.Rhythm().times(0).style.minWidth}>
                <div data-cross="center" data-gap="2" data-stack="x" data-wrap="nowrap">
                  <DumbbellIcon data-color="neutral-400" data-shrink="0" data-size="md" />

                  <h1
                    data-color="neutral-0"
                    data-fs="2xl"
                    data-fw="black"
                    data-md-fs="xl"
                    data-transform="truncate"
                  >
                    {t("workout.title", {
                      plan: workout.data.planName,
                      section: workout.data.planSectionName,
                    })}
                  </h1>
                </div>

                <div
                  data-color="neutral-500"
                  data-cross="center"
                  data-fs="xs"
                  data-gap="1-5"
                  data-stack="x"
                  data-wrap="wrap"
                >
                  {workout.actions.reschedule.available ? (
                    <WorkoutReschedule action={workout.actions.reschedule} {...workout.data} />
                  ) : (
                    <div>{DateFormat.dayWithWeekday(language, new Date(workout.data.scheduledFor))}</div>
                  )}

                  {workout.data.completedAt && (
                    <>
                      <div data-color="neutral-600">·</div>

                      <div>
                        {t("workout.completed_at", {
                          date: DateFormat.dayWithTime(language, DateFormat.zoned(workout.data.completedAt)),
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div
                data-cross="center"
                data-gap="0"
                data-self="start"
                data-stack="x"
                data-wrap="nowrap"
                {...bg.Rhythm().times(3).style.height}
              >
                <WorkoutStatusBadge data-mr="4" status={workout.data.status} />

                {workout.data.completedAt && (
                  <WorkoutCopy {...workout.data} completedAt={workout.data.completedAt} />
                )}

                {workout.actions.start.available && (
                  <WorkoutStart action={workout.actions.start} {...workout.data} />
                )}

                {workout.actions.complete.available && (
                  <WorkoutComplete action={workout.actions.complete} {...workout.data} />
                )}

                {workout.actions.discard.available && <WorkoutDiscard {...workout.data} />}
              </div>
            </div>

            <div data-md-ml="0" data-md-mt="3" data-ml="auto" {...bg.Rhythm(18).times(1).style.minHeight}>
              {workout.actions.start.available && <ActionHint action={workout.actions.start} />}

              {workout.actions.complete.available && <ActionHint action={workout.actions.complete} />}
            </div>

            {workout.actions.noteSet.available && (
              <WorkoutNote action={workout.actions.noteSet} {...workout.data} />
            )}
          </div>
        </div>
      </div>

      <div data-gap="3" data-stack="y">
        <div data-cross="center" data-gap="3" data-stack="x" data-wrap="wrap">
          <div
            data-color="neutral-500"
            data-cross="center"
            data-fs="sm"
            data-gap="1-5"
            data-grow="1"
            data-stack="x"
            title={t("workout.exercise.list.header")}
            {...bg.Rhythm().times(3).style.minHeight}
          >
            <Dumbbell data-size="xs" />

            <span data-transform="font-variant-numeric">
              {t("workout.exercise.list.count", {
                count: workout.data.exercises.length,
                max: WorkoutExerciseLimitMax,
              })}
            </span>
          </div>

          {workout.actions.exerciseAdd.available && (
            <WorkoutExerciseAdd action={workout.actions.exerciseAdd} {...workout.data} />
          )}
        </div>

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

        <ul data-gap="3" data-stack="y">
          {workout.data.exercises.map((exercise) => (
            <WorkoutExerciseRow exercise={exercise} key={exercise.id} workout={workout.data} />
          ))}
        </ul>
      </div>
    </Main>
  );
}
