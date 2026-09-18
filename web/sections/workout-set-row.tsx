import * as bg from "@bgord/ui";
import type { LoggedSet, WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import * as ui from "../components";
import { WorkoutSetCorrect } from "./workout-set-correct";
import { WorkoutSetRemove } from "./workout-set-remove";

export function WorkoutSetRow(props: { exercise: WorkoutExercise; loggedSet: LoggedSet }) {
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
          <WorkoutSetCorrect exercise={props.exercise} loggedSet={props.loggedSet} {...workoutSetCorrect} />

          {workoutSetCorrect.off && <WorkoutSetRemove exercise={props.exercise} loggedSet={props.loggedSet} />}
        </div>
      </div>

      {workoutSetCorrect.off && props.loggedSet.actions.remove.available && (
        <ui.ActionHint {...props.loggedSet.actions.remove} data-pl="5" />
      )}
    </ui.HairlineRow>
  );
}
