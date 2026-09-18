import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import { WorkoutSetRow } from "./workout-set-row";

export function WorkoutSetList(props: { exercise: WorkoutExercise }) {
  if (props.exercise.loggedSets.length === 0) return null;

  return (
    <ul data-stack="y">
      {props.exercise.loggedSets.map((loggedSet) => (
        <WorkoutSetRow exercise={props.exercise} key={loggedSet.id} loggedSet={loggedSet} />
      ))}
    </ul>
  );
}
