import * as bg from "@bgord/ui";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";
import * as ui from "../components";
import { usePersistedToggle } from "../hooks/use-persisted-toggle";
import { workoutRoute } from "../router";
import { WorkoutExerciseMove } from "./workout-exercise-move";
import { WorkoutExercisePreviousPerformance } from "./workout-exercise-previous-performance";
import { WorkoutExerciseRemove } from "./workout-exercise-remove";
import { WorkoutExerciseTarget } from "./workout-exercise-target";
import { WorkoutExerciseTargetSet } from "./workout-exercise-target-set";
import { WorkoutSetList } from "./workout-set-list";
import { WorkoutSetLog } from "./workout-set-log";

export function WorkoutExerciseRow(props: {
  exercise: WorkoutExercise;
  index: number;
  last: boolean;
  reordering: boolean;
}) {
  const t = bg.useTranslations();
  const { workout } = workoutRoute.useLoaderData();

  const workoutExerciseVisibility = usePersistedToggle({ name: `workout-exercise-${props.exercise.id}` });
  const workoutExerciseTarget = bg.useToggle({ name: `workout-exercise-target-${props.exercise.id}` });
  const workoutExerciseDescription = bg.useToggle({
    name: `workout-exercise-description-${props.exercise.id}`,
  });

  const isDraft = workout.data.status === WorkoutStatusEnum.draft;
  const isCompleted = workout.data.status === WorkoutStatusEnum.completed;
  const hasLoggedSets = props.exercise.loggedSets.length > 0;
  const hasTarget = props.exercise.target;

  const isSkipped = isCompleted && !hasLoggedSets;

  const target = !(isSkipped || isDraft) ? hasTarget : undefined;
  const isExpandable = !props.reordering && (hasLoggedSets || props.exercise.actions.setLog.available);

  const { width } = bg.useWindowDimensions();
  const mobile = width !== undefined && width <= 768;

  return (
    <ui.HairlineRow data-stack="y" first={props.index === 0} last={props.last} {...ui.Spacing.row}>
      <div data-stack="x" {...ui.Gap.related}>
        <WorkoutExerciseMove
          active={isDraft || props.reordering}
          exercise={props.exercise}
          position={props.index}
        >
          {isExpandable && <ui.ChevronToggle {...workoutExerciseVisibility} />}

          {!isExpandable && (
            <ui.RowIndex aria-hidden data-md-p="1" data-p="2-5" data-shrink="0" data-stack="x">
              <span data-transform="center" {...bg.Rhythm(16).times(1).style.width}>
                {(isDraft || props.reordering) && props.index + 1}
              </span>
            </ui.RowIndex>
          )}
        </WorkoutExerciseMove>

        <button
          aria-label={t("workout.exercise.description.toggle")}
          data-br="md"
          data-cursor="pointer"
          data-hover-opacity="medium"
          data-stack="x"
          onClick={workoutExerciseDescription.toggle}
          title={t("workout.exercise.description.toggle")}
          type="button"
          {...workoutExerciseDescription.props.controller}
        >
          <ui.ExerciseImage
            id={props.exercise.exerciseId}
            imageEtag={props.exercise.exerciseImageEtag}
            name={props.exercise.exerciseName}
            size={mobile ? ui.ExerciseImageSize.xs : ui.ExerciseImageSize.sm}
          />
        </button>

        <div data-basis="0" data-grow="1" data-minw="0" data-stack="y" {...ui.Gap.inline}>
          <ui.ExerciseLink
            params={{ exerciseId: props.exercise.exerciseId }}
            title={props.exercise.exerciseName}
            to="/catalog/exercise/$exerciseId"
          >
            {props.exercise.exerciseName}
          </ui.ExerciseLink>

          <div data-stack="x" {...ui.Gap.cluster}>
            <WorkoutExerciseTarget exercise={props.exercise} {...workoutExerciseTarget} />

            <small data-md-disp={hasTarget ? "none" : undefined}>
              <ui.SetsReps {...props.exercise.prescription} />
            </small>

            {target && (
              <div data-disp="none" data-md-disp="block" data-self="center">
                <ui.SetDots sets={props.exercise.loggedSets} target={target.sets} />
              </div>
            )}
          </div>

          <WorkoutExercisePreviousPerformance {...props.exercise} />
        </div>

        {isSkipped && (
          <ui.Chip data-shrink="0" muted>
            {t("workout.exercise.skipped")}
          </ui.Chip>
        )}

        {target && (
          <div data-md-disp="none">
            <ui.SetDots sets={props.exercise.loggedSets} target={target.sets} />
          </div>
        )}

        <WorkoutExerciseRemove {...props.exercise} />
      </div>

      {workoutExerciseDescription.on && (
        <div
          className="c-prose"
          data-color="neutral-300"
          {...ui.Spacing.inset}
          {...workoutExerciseDescription.props.target}
        >
          {props.exercise.exerciseDescription}
        </div>
      )}

      <WorkoutExerciseTargetSet exercise={props.exercise} {...workoutExerciseTarget} />

      {isExpandable && workoutExerciseVisibility.on && (
        <div data-stack="y" {...ui.Spacing.inset} {...workoutExerciseVisibility.props.target}>
          <WorkoutSetList {...props.exercise} />

          <WorkoutSetLog {...props.exercise} />
        </div>
      )}
    </ui.HairlineRow>
  );
}
