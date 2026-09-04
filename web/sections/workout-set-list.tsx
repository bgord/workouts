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
    <ul className="set-ledger" data-gap="0" data-stack="y">
      {props.exercise.loggedSets.map((loggedSet) => (
        <li
          className="set-row"
          data-cross="center"
          data-gap="2"
          data-hover-bg="neutral-800"
          data-px="2"
          data-py="1"
          data-stack="x"
          key={loggedSet.id}
        >
          <div data-color="neutral-100" data-ff="mono" data-fs="sm" data-grow="1" data-ls="tight">
            {t("workout.exercise.logged_set", {
              setNumber: loggedSet.setNumber,
              reps: loggedSet.reps,
              load: loggedSet.load / GRAMS_IN_KILOGRAM,
            })}
          </div>

          {correctable && (
            <WorkoutSetCorrect exercise={props.exercise} loggedSet={loggedSet} workout={props.workout} />
          )}

          {correctable && (
            <WorkoutSetRemove exercise={props.exercise} loggedSet={loggedSet} workout={props.workout} />
          )}
        </li>
      ))}
    </ul>
  );
}
