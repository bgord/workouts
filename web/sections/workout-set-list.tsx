import type { LoggedSet, WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import type { useSetCorrection } from "../hooks/use-set-correction";
import { WorkoutSetRow } from "./workout-set-row";

export function WorkoutSetList(props: {
  exercise: WorkoutExercise;
  pendingSet: LoggedSet | null;
  correction: ReturnType<typeof useSetCorrection>;
  first?: boolean;
}) {
  if (props.exercise.loggedSets.length === 0) return null;

  return (
    <ul data-stack="y">
      {props.exercise.loggedSets.map((loggedSet, index) => (
        <WorkoutSetRow
          exercise={props.exercise}
          first={props.first && index === 0}
          key={loggedSet.id}
          loggedSet={loggedSet}
          pending={loggedSet === props.pendingSet}
          workoutSetCorrect={props.correction.toggle(loggedSet.id)}
        />
      ))}
    </ul>
  );
}
