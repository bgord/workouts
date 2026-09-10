import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import { RepsLoad } from "../components/reps-load";
import { RirBadge } from "../components/rir-badge";
import { WorkoutSetCorrect } from "./workout-set-correct";
import { WorkoutSetRemove } from "./workout-set-remove";

export function WorkoutSetList(props: { workout: Workout; exercise: WorkoutExercise }) {
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

          <div data-color="neutral-100" data-fs="sm" data-fw="medium">
            <RepsLoad load={loggedSet.load} reps={loggedSet.reps} />
          </div>

          <div data-grow="1">{loggedSet.rir !== undefined && <RirBadge rir={loggedSet.rir} />}</div>

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
