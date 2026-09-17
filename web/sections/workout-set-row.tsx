import * as bg from "@bgord/ui";
import type { LoggedSet, WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import * as ui from "../components";
import { WorkoutSetCorrect } from "./workout-set-correct";
import { WorkoutSetRemove } from "./workout-set-remove";

export function WorkoutSetRow(props: { workout: Workout; exercise: WorkoutExercise; loggedSet: LoggedSet }) {
  const workoutSetCorrect = bg.useToggle({ name: `correct-${props.loggedSet.id}` });

  return (
    <ui.HairlineRow data-stack="y" tone="subtle" {...ui.Spacing.rowCompact} {...ui.Gap.inline}>
      <div data-cross="center" data-stack="x" data-wrap="nowrap" {...ui.Gap.related}>
        <ui.RowIndex data-md-disp={workoutSetCorrect.on ? "none" : undefined}>
          {props.loggedSet.setNumber}
        </ui.RowIndex>

        {workoutSetCorrect.off && (
          <div data-color="neutral-100" data-fs="sm" data-fw="medium">
            <ui.RepsLoad load={props.loggedSet.load} reps={props.loggedSet.reps} />
          </div>
        )}

        {workoutSetCorrect.off && (
          <div data-grow="1">
            {props.loggedSet.rir !== undefined && <ui.RirBadge rir={props.loggedSet.rir} />}
          </div>
        )}

        <div
          data-cross="center"
          data-grow={workoutSetCorrect.on ? "1" : undefined}
          data-shrink="0"
          data-stack="x"
          data-wrap="nowrap"
          {...ui.Gap.inline}
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
        <ui.ActionHint {...props.loggedSet.actions.remove} data-pl="5" />
      )}
    </ui.HairlineRow>
  );
}
