// fallow-ignore-file unused-export
/* cSpell:disable */
import * as bg from "@bgord/ui";
import * as ui from "../components";
import { workoutRoute } from "../router";
import { WorkoutComplete } from "../sections/workout-complete";
import { WorkoutCooldown } from "../sections/workout-cooldown";
import { WorkoutCopy } from "../sections/workout-copy";
import { WorkoutDiscard } from "../sections/workout-discard";
import { WorkoutExerciseAdd } from "../sections/workout-exercise-add";
import { WorkoutExerciseRow } from "../sections/workout-exercise-row";
import { WorkoutExercisesEmpty } from "../sections/workout-exercises-empty";
import { WorkoutNote } from "../sections/workout-note";
import { WorkoutPinDock } from "../sections/workout-pin-dock";
import { WorkoutReorder } from "../sections/workout-reorder";
import { WorkoutScheduledFor } from "../sections/workout-scheduled-for";
import { WorkoutStart } from "../sections/workout-start";
import { WorkoutWarmup } from "../sections/workout-warmup";

export function Workout() {
  const t = bg.useTranslations();
  const { workout } = workoutRoute.useLoaderData();
  const search = workoutRoute.useSearch();

  const workoutReorder = bg.useToggle({ name: `workout-reorder-${workout.data.id}` });

  const primary = workout.actions.start.available || workout.actions.complete.available;

  return (
    <ui.Main>
      <div data-stack="y" {...ui.Gap.related}>
        <div data-md-wrap="wrap" data-stack="x" {...ui.Gap.related}>
          <ui.ButtonBack search={search} to="/workouts" />

          <div data-basis="0" data-grow="1" data-minw="0" data-stack="x" {...ui.Gap.related}>
            <h1>
              {t("workout.title", { plan: workout.data.planName, section: workout.data.planSectionName })}
            </h1>

            <ui.WorkoutStatusBadge status={workout.data.status} />
          </div>

          <div
            data-md-width={primary ? "100%" : undefined}
            data-shrink="0"
            data-stack="x"
            {...ui.Gap.cluster}
          >
            <WorkoutStart />

            <WorkoutComplete />

            <div data-ml="auto" data-stack="x">
              <WorkoutReorder {...workoutReorder} />

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

      <WorkoutWarmup />

      <WorkoutExercisesEmpty />

      <div data-stack="y">
        <ul data-stack="y">
          {workout.data.exercises.map((exercise, index) => (
            <WorkoutExerciseRow
              exercise={exercise}
              index={index}
              key={exercise.id}
              last={index === workout.data.exercises.length - 1 && !workout.actions.exerciseAdd.available}
              reordering={workoutReorder.on}
            />
          ))}
        </ul>

        <WorkoutExerciseAdd />
      </div>

      <WorkoutCooldown />

      <WorkoutPinDock />
    </ui.Main>
  );
}
