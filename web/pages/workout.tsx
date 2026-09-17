// fallow-ignore-file unused-export
/* cSpell:disable */
import * as bg from "@bgord/ui";
import * as ui from "../components";
import { workoutRoute } from "../router";
import { WorkoutComplete } from "../sections/workout-complete";
import { WorkoutCopy } from "../sections/workout-copy";
import { WorkoutDiscard } from "../sections/workout-discard";
import { WorkoutExerciseAdd } from "../sections/workout-exercise-add";
import { WorkoutExerciseRow } from "../sections/workout-exercise-row";
import { WorkoutExercisesEmpty } from "../sections/workout-exercises-empty";
import { WorkoutNote } from "../sections/workout-note";
import { WorkoutScheduledFor } from "../sections/workout-scheduled-for";
import { WorkoutStart } from "../sections/workout-start";

export function Workout() {
  const t = bg.useTranslations();
  const { workout } = workoutRoute.useLoaderData();
  const search = workoutRoute.useSearch();

  const primary = workout.actions.start.available || workout.actions.complete.available;

  return (
    <ui.Main>
      <div data-stack="y" {...ui.Gap.related}>
        <div data-cross="center" data-md-wrap="wrap" data-stack="x" data-wrap="nowrap" {...ui.Gap.related}>
          <ui.ButtonBack search={search} to="/workouts" />

          <div
            data-cross="center"
            data-grow="1"
            data-stack="x"
            data-wrap="nowrap"
            style={{ flexBasis: 0, minWidth: 0 }}
            {...ui.Gap.related}
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
            data-md-width={primary ? "100%" : undefined}
            data-shrink="0"
            data-stack="x"
            data-wrap="nowrap"
            {...ui.Gap.cluster}
          >
            <WorkoutStart />

            <WorkoutComplete />

            <div data-cross="center" data-ml="auto" data-stack="x" data-wrap="nowrap">
              <WorkoutCopy />

              <WorkoutDiscard />
            </div>
          </div>
        </div>

        <div data-stack="y" {...ui.Spacing.inset} {...ui.Gap.related}>
          <WorkoutScheduledFor />

          <WorkoutNote />

          {workout.actions.start.available && <ui.ActionHint {...workout.actions.start} />}
          {workout.actions.complete.available && <ui.ActionHint {...workout.actions.complete} />}
        </div>
      </div>

      <div data-stack="y">
        <WorkoutExercisesEmpty />

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
          <div data-stack="y" {...ui.Gap.cluster}>
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
