import { useTranslations } from "@bgord/ui";
import type { Workout, WorkoutExerciseWithSets } from "../../modules/workouts/value-objects/workout";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";
import { WorkoutSetCorrect } from "./workout-set-correct";
import { WorkoutSetRemove } from "./workout-set-remove";

const GRAMS_IN_KILOGRAM = 1000;

const CORRECTABLE = [WorkoutStatusEnum.in_progress, WorkoutStatusEnum.completed];

export function WorkoutSetList(props: { workout: Workout; exercise: WorkoutExerciseWithSets }) {
  const t = useTranslations();

  if (props.exercise.loggedSets.length === 0) return null;

  const correctable = CORRECTABLE.includes(props.workout.status);

  return (
    <ul className="c-card" data-gap="0" data-p="0" data-stack="y" data-variant="sunken">
      {props.exercise.loggedSets.map((loggedSet, index) => (
        <li
          data-bct={index > 0 ? "alpha-subtle" : undefined}
          data-bst={index > 0 ? "solid" : undefined}
          data-bwt={index > 0 ? "hairline" : undefined}
          data-cross="baseline"
          data-gap="3"
          data-hover-bg="alpha-subtle"
          data-px="3"
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
            {correctable && (
              <WorkoutSetCorrect exercise={props.exercise} loggedSet={loggedSet} workout={props.workout} />
            )}

            {correctable && (
              <WorkoutSetRemove exercise={props.exercise} loggedSet={loggedSet} workout={props.workout} />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
