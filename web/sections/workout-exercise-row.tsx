import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";
import * as ui from "../components";
import { usePersistedToggle } from "../hooks/use-persisted-toggle";
import { workoutRoute } from "../router";
import { WorkoutExerciseRemove } from "./workout-exercise-remove";
import { WorkoutExerciseTarget } from "./workout-exercise-target";
import { WorkoutExerciseTargetSet } from "./workout-exercise-target-set";
import { WorkoutSetList } from "./workout-set-list";
import { WorkoutSetLog } from "./workout-set-log";

export function WorkoutExerciseRow(props: { exercise: WorkoutExercise; index: number; last: boolean }) {
  const t = bg.useTranslations();
  const { workout } = workoutRoute.useLoaderData();

  const workoutExerciseVisibility = usePersistedToggle({ name: `workout-exercise-${props.exercise.id}` });
  const workoutExerciseTarget = bg.useToggle({ name: `workout-exercise-target-${props.exercise.id}` });
  const workoutExerciseDescription = bg.useToggle({
    name: `workout-exercise-description-${props.exercise.id}`,
  });

  const exercise = {
    id: props.exercise.exerciseId,
    name: props.exercise.exerciseName,
    imageEtag: props.exercise.exerciseImageEtag,
  };

  const draft = workout.data.status === WorkoutStatusEnum.draft;

  const skipped =
    workout.data.status === WorkoutStatusEnum.completed && props.exercise.loggedSets.length === 0;

  const expandable = props.exercise.loggedSets.length > 0 || props.exercise.actions.setLog.available;

  const { width } = bg.useWindowDimensions();
  const mobile = width !== undefined && width <= 768;

  return (
    <ui.HairlineRow data-stack="y" first={props.index === 0} last={props.last} {...ui.Spacing.row}>
      <div data-cross="center" data-stack="x" data-wrap="nowrap" {...ui.Gap.related}>
        {expandable && <ui.ChevronToggle {...workoutExerciseVisibility} />}

        {!expandable && (
          <ui.RowIndex aria-hidden data-md-p="1" data-p="2-5" data-shrink="0" data-stack="x">
            <span data-transform="center" {...bg.Rhythm(16).times(1).style.width}>
              {draft && props.index + 1}
            </span>
          </ui.RowIndex>
        )}

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
          <ui.ExerciseImage size={mobile ? ui.ExerciseImageSize.xs : ui.ExerciseImageSize.sm} {...exercise} />
        </button>

        <div data-basis="0" data-grow="1" data-minw="0" data-stack="y" {...ui.Gap.inline}>
          <Link
            data-color="neutral-100"
            data-fs="sm"
            data-fw="medium"
            data-hover-color="brand-300"
            data-transform="truncate"
            params={{ exerciseId: props.exercise.exerciseId }}
            title={props.exercise.exerciseName}
            to="/catalog/exercise/$exerciseId"
          >
            {props.exercise.exerciseName}
          </Link>

          <div data-cross="baseline" data-stack="x" data-wrap="nowrap" {...ui.Gap.cluster}>
            <WorkoutExerciseTarget exercise={props.exercise} {...workoutExerciseTarget} />

            <ui.Meta data-md-disp={props.exercise.target ? "none" : undefined}>
              <ui.SetsReps {...props.exercise.prescription} />
            </ui.Meta>

            {mobile && !skipped && props.exercise.target && !draft && (
              <div data-self="center">
                <ui.SetDots sets={props.exercise.loggedSets} target={props.exercise.target.sets} />
              </div>
            )}
          </div>
        </div>

        {skipped && (
          <ui.Chip data-shrink="0" muted>
            {t("workout.exercise.skipped")}
          </ui.Chip>
        )}

        {!(mobile || skipped) && props.exercise.target && !draft && (
          <ui.SetDots sets={props.exercise.loggedSets} target={props.exercise.target.sets} />
        )}

        <WorkoutExerciseRemove {...props.exercise} />
      </div>

      {workoutExerciseDescription.on && (
        <div
          className="c-prose"
          data-color="neutral-300"
          data-fs="sm"
          {...ui.Spacing.inset}
          {...workoutExerciseDescription.props.target}
        >
          {props.exercise.exerciseDescription}
        </div>
      )}

      <WorkoutExerciseTargetSet exercise={props.exercise} {...workoutExerciseTarget} />

      {expandable && workoutExerciseVisibility.on && (
        <div data-stack="y" {...ui.Spacing.inset} {...workoutExerciseVisibility.props.target}>
          <WorkoutSetList exercise={props.exercise} />

          <WorkoutSetLog {...props.exercise} />
        </div>
      )}
    </ui.HairlineRow>
  );
}
