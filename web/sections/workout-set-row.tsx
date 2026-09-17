import * as bg from "@bgord/ui";
import type { LoggedSet, WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import { ActionHint, HairlineRow } from "../components";
import { RepsLoad } from "../components/reps-load";
import { RirBadge } from "../components/rir-badge";
import { WorkoutSetCorrect } from "./workout-set-correct";
import { WorkoutSetRemove } from "./workout-set-remove";

export function WorkoutSetRow(props: { workout: Workout; exercise: WorkoutExercise; loggedSet: LoggedSet }) {
  const workoutSetCorrect = bg.useToggle({ name: `correct-${props.loggedSet.id}` });

  return (
    <HairlineRow data-gap="1" data-py="1-5" data-stack="y" tone="subtle">
      <div data-cross="center" data-gap="3" data-stack="x" data-wrap="nowrap">
        <div
          data-color="neutral-600"
          data-fs="xs"
          data-md-disp={workoutSetCorrect.on ? "none" : undefined}
          data-transform="font-variant-numeric"
        >
          {props.loggedSet.setNumber}
        </div>

        {workoutSetCorrect.off && (
          <div data-color="neutral-100" data-fs="sm" data-fw="medium">
            <RepsLoad load={props.loggedSet.load} reps={props.loggedSet.reps} />
          </div>
        )}

        {workoutSetCorrect.off && (
          <div data-grow="1">
            {props.loggedSet.rir !== undefined && <RirBadge rir={props.loggedSet.rir} />}
          </div>
        )}

        <div
          data-cross="center"
          data-gap="1"
          data-grow={workoutSetCorrect.on ? "1" : undefined}
          data-shrink="0"
          data-stack="x"
          data-wrap="nowrap"
        >
          {props.loggedSet.actions.correct.available && (
            <WorkoutSetCorrect
              action={props.loggedSet.actions.correct}
              exercise={props.exercise}
              loggedSet={props.loggedSet}
              workout={props.workout}
              {...workoutSetCorrect}
            />
          )}

          {workoutSetCorrect.off && props.loggedSet.actions.remove.available && (
            <WorkoutSetRemove
              action={props.loggedSet.actions.remove}
              exercise={props.exercise}
              loggedSet={props.loggedSet}
              workout={props.workout}
            />
          )}
        </div>
      </div>

      {workoutSetCorrect.off && props.loggedSet.actions.remove.available && (
        <ActionHint {...props.loggedSet.actions.remove} data-pl="5" />
      )}
    </HairlineRow>
  );
}
