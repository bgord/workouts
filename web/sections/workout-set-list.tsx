import { useTranslations } from "@bgord/ui";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import { WorkoutSetCorrect } from "./workout-set-correct";
import { WorkoutSetRemove } from "./workout-set-remove";

const GRAMS_IN_KILOGRAM = 1000;

export function WorkoutSetList(props: { workout: Workout; exercise: WorkoutExercise }) {
  const t = useTranslations();

  if (props.exercise.loggedSets.length === 0) return null;

  return (
    <ul data-bct="alpha-subtle" data-bst="solid" data-bwt="hairline" data-gap="0" data-stack="y">
      {props.exercise.loggedSets.map((loggedSet, index) => (
        <li
          data-bct={index > 0 ? "alpha-subtle" : undefined}
          data-bst={index > 0 ? "solid" : undefined}
          data-bwt={index > 0 ? "hairline" : undefined}
          data-cross="center"
          data-gap="3"
          data-py="2"
          data-stack="x"
          key={loggedSet.id}
        >
          <div className="c-badge" data-variant="outline">
            {loggedSet.setNumber}
          </div>

          <div data-color="neutral-100" data-fs="sm" data-fw="medium" data-grow="1">
            {t("workout.exercise.logged_set", {
              reps: loggedSet.reps,
              load: loggedSet.load / GRAMS_IN_KILOGRAM,
            })}
          </div>

          <div data-stack="x">
            {loggedSet.actions.correct.available && (
              <WorkoutSetCorrect
                action={loggedSet.actions.correct}
                exercise={props.exercise}
                loggedSet={loggedSet}
                workout={props.workout}
              />
            )}

            {loggedSet.actions.remove.available && (
              <WorkoutSetRemove
                action={loggedSet.actions.remove}
                exercise={props.exercise}
                loggedSet={loggedSet}
                workout={props.workout}
              />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
