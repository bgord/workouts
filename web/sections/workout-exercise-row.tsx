import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Pencil, Target } from "lucide-react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";
import * as ui from "../components";
import { usePersistedToggle } from "../hooks/use-persisted-toggle";
import { WorkoutExerciseRemove } from "./workout-exercise-remove";
import { WorkoutExerciseTargetSet } from "./workout-exercise-target-set";
import { WorkoutSetList } from "./workout-set-list";
import { WorkoutSetLog } from "./workout-set-log";

export function WorkoutExerciseRow(props: {
  workout: Workout;
  exercise: WorkoutExercise;
  index: number;
  last: boolean;
}) {
  const t = bg.useTranslations();

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

  const skipped =
    props.workout.status === WorkoutStatusEnum.completed && props.exercise.loggedSets.length === 0;

  const expandable = props.exercise.loggedSets.length > 0 || props.exercise.actions.setLog.available;

  const { width } = bg.useWindowDimensions();
  const mobile = width !== undefined && width <= 768;

  const actions = (
    <div data-cross="center" data-shrink="0" data-stack="x" data-wrap="nowrap" {...ui.Spacing.inline}>
      {props.exercise.actions.remove.available && (
        <WorkoutExerciseRemove
          action={props.exercise.actions.remove}
          exercise={props.exercise}
          workout={props.workout}
        />
      )}
    </div>
  );

  return (
    <ui.HairlineRow data-stack="y" first={props.index === 0} last={props.last} {...ui.Spacing.row}>
      <div data-cross="center" data-stack="x" data-wrap="nowrap" {...ui.Spacing.related}>
        {expandable ? (
          <ui.ChevronToggle {...workoutExerciseVisibility} />
        ) : (
          <ui.RowIndex aria-hidden data-md-p="1" data-p="2-5" data-shrink="0" data-stack="x">
            <span data-transform="center" {...bg.Rhythm(16).times(1).style.width}>
              {props.workout.status === WorkoutStatusEnum.draft && props.index + 1}
            </span>
          </ui.RowIndex>
        )}

        <button
          aria-label={t("workout.exercise.description.toggle")}
          data-br="md"
          data-cursor="pointer"
          data-hover-opacity="medium"
          data-p="0"
          data-shrink="0"
          data-stack="x"
          onClick={workoutExerciseDescription.toggle}
          title={t("workout.exercise.description.toggle")}
          type="button"
          {...workoutExerciseDescription.props.controller}
        >
          <ui.ExerciseImage size={mobile ? ui.ExerciseImageSize.xs : ui.ExerciseImageSize.sm} {...exercise} />
        </button>

        <div data-grow="1" data-stack="y" style={{ flexBasis: 0, minWidth: 0 }} {...ui.Spacing.inline}>
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

          <div data-cross="baseline" data-stack="x" data-wrap="nowrap" {...ui.Spacing.cluster}>
            {props.exercise.actions.targetSet.available ? (
              <button
                data-bc={props.exercise.target ? undefined : "neutral-700"}
                data-br="sm"
                data-bs={props.exercise.target ? undefined : "dashed"}
                data-bw={props.exercise.target ? undefined : "hairline"}
                data-color={props.exercise.target ? "neutral-300" : "neutral-400"}
                data-cross="center"
                data-cursor="pointer"
                data-fs={props.exercise.target ? "sm" : "xs"}
                data-fw={props.exercise.target ? "medium" : undefined}
                data-hover-color="neutral-0"
                data-px={props.exercise.target ? undefined : "2"}
                data-shrink="0"
                data-stack="x"
                data-transform="font-variant-numeric"
                data-wrap="nowrap"
                disabled={!props.exercise.actions.targetSet.enabled}
                onClick={workoutExerciseTarget.toggle}
                title={t("workout.target.cta")}
                type="button"
                {...ui.Spacing.inline}
                {...workoutExerciseTarget.props.controller}
              >
                <Target data-color="neutral-500" data-size="xs" />

                {props.exercise.target ? (
                  <>
                    <ui.SetsRepsLoad
                      load={props.exercise.target.load}
                      reps={props.exercise.target.reps}
                      sets={props.exercise.target.sets}
                    />
                    <Pencil data-color="neutral-600" data-ml="1" data-size="xs" />
                  </>
                ) : (
                  t("workout.target.cta")
                )}
              </button>
            ) : (
              props.exercise.target && (
                <div
                  data-color="neutral-300"
                  data-cross="center"
                  data-fs="sm"
                  data-fw="medium"
                  data-shrink="0"
                  data-stack="x"
                  data-transform="font-variant-numeric"
                  data-wrap="nowrap"
                  {...ui.Spacing.inline}
                >
                  <Target data-color="neutral-500" data-size="xs" />
                  <ui.SetsRepsLoad
                    load={props.exercise.target.load}
                    reps={props.exercise.target.reps}
                    sets={props.exercise.target.sets}
                  />
                </div>
              )
            )}

            <ui.Meta data-md-disp={props.exercise.target ? "none" : undefined}>
              <ui.SetsReps {...props.exercise.prescription} />
            </ui.Meta>

            {mobile &&
              !skipped &&
              props.exercise.target &&
              props.workout.status !== WorkoutStatusEnum.draft && (
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

        {!(mobile || skipped) &&
          props.exercise.target &&
          props.workout.status !== WorkoutStatusEnum.draft && (
            <ui.SetDots sets={props.exercise.loggedSets} target={props.exercise.target.sets} />
          )}

        {actions}
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

      {workoutExerciseTarget.on && props.exercise.actions.targetSet.available && (
        <div {...ui.Spacing.inset}>
          <WorkoutExerciseTargetSet
            action={props.exercise.actions.targetSet}
            exercise={props.exercise}
            workout={props.workout}
            {...workoutExerciseTarget}
          />
        </div>
      )}

      {expandable && workoutExerciseVisibility.on && (
        <div data-stack="y" {...ui.Spacing.inset} {...workoutExerciseVisibility.props.target}>
          <WorkoutSetList exercise={props.exercise} workout={props.workout} />

          {props.exercise.actions.setLog.available && (
            <WorkoutSetLog
              action={props.exercise.actions.setLog}
              exercise={props.exercise}
              workout={props.workout}
            />
          )}
        </div>
      )}
    </ui.HairlineRow>
  );
}
