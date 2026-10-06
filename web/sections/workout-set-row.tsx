import type * as bg from "@bgord/ui";
import type { LoggedSet, WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import * as ui from "../components";
import { WorkoutSetCorrect } from "./workout-set-correct";
import { WorkoutSetRemove } from "./workout-set-remove";

export function WorkoutSetRow(props: {
  exercise: WorkoutExercise;
  loggedSet: LoggedSet;
  pending: boolean;
  first?: boolean;
  workoutSetCorrect: bg.UseToggleReturnType;
}) {
  const { workoutSetCorrect } = props;

  return (
    <ui.HairlineRow
      aria-busy={props.pending}
      data-opacity={props.pending ? "high" : undefined}
      data-stack="y"
      first={props.first}
      tone="subtle"
      {...ui.Spacing.rowCompact}
      {...ui.Gap.inline}
    >
      <div data-stack="x" {...ui.Gap.related}>
        <div
          data-cross="baseline"
          data-grow={workoutSetCorrect.off ? "1" : undefined}
          data-md-disp={workoutSetCorrect.on ? "none" : undefined}
          data-stack="x"
          {...ui.Gap.related}
        >
          <ui.RowIndex>{props.loggedSet.setNumber}</ui.RowIndex>

          {workoutSetCorrect.off && (
            <>
              <ui.SetValue
                data-color="neutral-100"
                data-fw="medium"
                load={props.loggedSet.load}
                reps={props.loggedSet.reps}
                resistance={props.exercise.resistance}
              />

              {props.loggedSet.rir !== null && <ui.RirBadge rir={props.loggedSet.rir} />}
            </>
          )}
        </div>

        <div
          data-grow={workoutSetCorrect.on ? "1" : undefined}
          data-shrink="0"
          data-stack="x"
          {...ui.Gap.inline}
        >
          <WorkoutSetCorrect exercise={props.exercise} loggedSet={props.loggedSet} {...workoutSetCorrect} />

          {workoutSetCorrect.off && (
            <WorkoutSetRemove exercise={props.exercise} loggedSet={props.loggedSet} />
          )}
        </div>
      </div>

      {workoutSetCorrect.off && props.loggedSet.actions.remove.available && (
        <ui.ActionHint
          {...props.loggedSet.actions.remove}
          data-pl="5"
          id={`workout-set-remove-hint-${props.loggedSet.id}`}
        />
      )}
    </ui.HairlineRow>
  );
}
