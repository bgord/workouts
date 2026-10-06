/* cSpell:disable */
import * as bg from "@bgord/ui";
import * as ui from "../components";
import { workoutRoute } from "../router";
import { WorkoutCooldown } from "../sections/workout-cooldown";
import { WorkoutCopy } from "../sections/workout-copy";
import { WorkoutDiscard } from "../sections/workout-discard";
import { WorkoutExerciseAdd } from "../sections/workout-exercise-add";
import { WorkoutExerciseRow } from "../sections/workout-exercise-row";
import { WorkoutExercisesEmpty } from "../sections/workout-exercises-empty";
import { WorkoutIdentity } from "../sections/workout-identity";
import { WorkoutLogPanel } from "../sections/workout-log-panel";
import { WorkoutNote, WorkoutNoteMenuItem } from "../sections/workout-note";
import { WorkoutReorder, WorkoutReorderStrip } from "../sections/workout-reorder";
import { WorkoutStatus } from "../sections/workout-status";
import { WorkoutWarmup } from "../sections/workout-warmup";

export function Workout() {
  const t = bg.useTranslations();
  const { workout } = workoutRoute.useLoaderData();
  const search = workoutRoute.useSearch();

  const workoutReorder = bg.useToggle({ name: `workout-reorder-${workout.data.id}` });
  const workoutNoteUpdate = bg.useToggle({ name: `workout-note-update-${workout.data.id}` });

  return (
    <ui.Main>
      <div data-stack="y" {...ui.Gap.block}>
        <WorkoutIdentity
          back={<ui.ButtonBack data-self="center" search={search} to="/workouts" />}
          menu={
            <bg.Menu name="workout-menu">
              <ui.MenuTrigger />

              <bg.MenuContent>
                <WorkoutNoteMenuItem {...workoutNoteUpdate} />

                <WorkoutCopy />

                <WorkoutReorder {...workoutReorder} />

                {(workoutNoteUpdate.off ||
                  workout.data.completedAt ||
                  (workout.actions.reorder.available && workoutReorder.off)) && <bg.MenuSeparator />}

                <WorkoutDiscard />
              </bg.MenuContent>
            </bg.Menu>
          }
        />

        <WorkoutStatus />

        <WorkoutNote {...workoutNoteUpdate} />

        <WorkoutReorderStrip {...workoutReorder} />
      </div>

      <WorkoutWarmup />

      <WorkoutExercisesEmpty />

      <div data-stack="y">
        <ul aria-label={t("workout.exercises")} data-stack="y">
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

      <WorkoutLogPanel />
    </ui.Main>
  );
}
