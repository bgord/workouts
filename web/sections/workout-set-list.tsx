import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import { WorkoutSetRow } from "./workout-set-row";

export function WorkoutSetList(props: { workout: Workout; exercise: WorkoutExercise }) {
  if (props.exercise.loggedSets.length === 0) return null;

  return (
    <ul data-gap="0" data-stack="y">
      {props.exercise.loggedSets.map((loggedSet) => (
        <WorkoutSetRow
          exercise={props.exercise}
          key={loggedSet.id}
          loggedSet={loggedSet}
          workout={props.workout}
        />
      ))}
    </ul>
  );
}
