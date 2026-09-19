import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import { WorkoutSetRow } from "./workout-set-row";

export function WorkoutSetList(props: WorkoutExercise) {
  if (props.loggedSets.length === 0) return null;

  return (
    <ul data-stack="y">
      {props.loggedSets.map((loggedSet) => (
        <WorkoutSetRow exercise={props} key={loggedSet.id} loggedSet={loggedSet} />
      ))}
    </ul>
  );
}
