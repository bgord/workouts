// fallow-ignore-file unused-export
/* cSpell:disable */
import * as bg from "@bgord/ui";
import { Dumbbell } from "lucide-react";
import * as ui from "../components";
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
      <ui.Main>
        <ui.LinkBack search={search} to="/workouts" />

        <div data-color="neutral-400">{t("workout.not_found")}</div>
      </ui.Main>
    );
  }

  const primary = workout.actions.start.available || workout.actions.complete.available;

  return (
    <ui.Main>
      <div data-gap="3" data-stack="y">
        <div data-cross="center" data-gap="3" data-md-wrap="wrap" data-stack="x" data-wrap="nowrap">
          <ui.ButtonBack search={search} to="/workouts" />

          <div
            data-cross="center"
            data-gap="3"
            data-grow="1"
            data-stack="x"
            data-wrap="nowrap"
            style={{ flexBasis: 0, minWidth: 0 }}
          >
            <ui.Header>
              {t("workout.title", { plan: workout.data.planName, section: workout.data.planSectionName })}
            </ui.Header>

            <div data-cross="center" data-self="start" data-stack="x" {...bg.Rhythm().times(3).style.height}>
              <ui.WorkoutStatusBadge status={workout.data.status} />
            </div>
          </div>

          <div
            data-cross="center"
            data-gap="2"
            data-md-pl={primary ? "4" : undefined}
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

            <div data-cross="center" data-stack="x" data-wrap="nowrap" data-ml="auto">
              {workout.data.completedAt && (
                <WorkoutCopy {...workout.data} completedAt={workout.data.completedAt} />
              )}

              {workout.actions.discard.available && <WorkoutDiscard {...workout.data} />}
            </div>
          </div>
        </div>

        <div data-gap="3" data-md-pl="4" data-pl="12" data-stack="y">
          {workout.actions.reschedule.available ? (
            <WorkoutReschedule action={workout.actions.reschedule} {...workout.data} />
          ) : (
            <ui.Meta>
              {DateFormat.dayWithWeekday(language, Temporal.PlainDate.from(workout.data.scheduledFor))}
            </ui.Meta>
          )}

          {workout.actions.noteSet.available && (
            <WorkoutNote action={workout.actions.noteSet} {...workout.data} />
          )}

          {workout.actions.start.available && <ui.ActionHint {...workout.actions.start} />}

          {workout.actions.complete.available && <ui.ActionHint {...workout.actions.complete} />}
        </div>
      </div>

      <div data-stack="y">
        {workout.data.exercises.length === 0 && !workout.actions.exerciseAdd.available && (
          <ui.EmptyState>
            <ui.EmptyStateIcon icon={Dumbbell} />

            <ui.EmptyStateMessage>{t("workout.exercise.list.empty")}</ui.EmptyStateMessage>
          </ui.EmptyState>
        )}

        <ul data-stack="y">
          {workout.data.exercises.map((exercise, index) => (
            <WorkoutExerciseRow
              exercise={exercise}
              index={index}
              key={exercise.id}
              last={index === workout.data.exercises.length - 1 && !workout.actions.exerciseAdd.available}
              workout={workout.data}
            />
          ))}
        </ul>

        {workout.actions.exerciseAdd.available && (
          <div data-gap="2" data-stack="y">
            <WorkoutExerciseAdd
              action={workout.actions.exerciseAdd}
              first={workout.data.exercises.length === 0}
              {...workout.data}
            />

            {workout.data.exercises.length === 0 && (
              <ui.Meta>{t("workout.exercise.list.empty.hint")}</ui.Meta>
            )}
          </div>
        )}
      </div>
    </ui.Main>
  );
}
