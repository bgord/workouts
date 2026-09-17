import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Pencil, Target } from "lucide-react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";
import { ChevronToggle, Chip, HairlineRow, Meta, RowIndex } from "../components";
import { ExerciseImage, ExerciseImageSize } from "../components/exercise-image";
import { SetDots } from "../components/set-dots";
import { SetsReps } from "../components/sets-reps";
import { SetsRepsLoad } from "../components/sets-reps-load";
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
    <div data-cross="center" data-gap="1" data-shrink="0" data-stack="x" data-wrap="nowrap">
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
    <HairlineRow
      data-gap="2"
      data-pb={props.last ? undefined : "4"}
      data-pt={props.index === 0 ? undefined : "4"}
      data-stack="y"
      first={props.index === 0}
    >
      <div data-cross="center" data-gap="3" data-md-gap="2" data-stack="x" data-wrap="nowrap">
        {expandable ? (
          <ChevronToggle {...workoutExerciseVisibility} />
        ) : (
          <RowIndex aria-hidden data-md-p="1" data-p="2-5" data-shrink="0" data-stack="x">
            <span data-transform="center" {...bg.Rhythm(16).times(1).style.width}>
              {props.workout.status === WorkoutStatusEnum.draft && props.index + 1}
            </span>
          </RowIndex>
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
          <ExerciseImage size={mobile ? ExerciseImageSize.xs : ExerciseImageSize.sm} {...exercise} />
        </button>

        <div data-gap="1" data-grow="1" data-stack="y" style={{ flexBasis: 0, minWidth: 0 }}>
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

          <div data-cross="baseline" data-gap="2" data-stack="x" data-wrap="nowrap">
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
                data-gap="1"
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
                {...workoutExerciseTarget.props.controller}
              >
                <Target data-color="neutral-500" data-size="xs" />

                {props.exercise.target ? (
                  <>
                    <SetsRepsLoad
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
                  data-gap="1"
                  data-shrink="0"
                  data-stack="x"
                  data-transform="font-variant-numeric"
                  data-wrap="nowrap"
                >
                  <Target data-color="neutral-500" data-size="xs" />
                  <SetsRepsLoad
                    load={props.exercise.target.load}
                    reps={props.exercise.target.reps}
                    sets={props.exercise.target.sets}
                  />
                </div>
              )
            )}

            <Meta data-md-disp={props.exercise.target ? "none" : undefined}>
              <SetsReps {...props.exercise.prescription} />
            </Meta>

            {mobile &&
              !skipped &&
              props.exercise.target &&
              props.workout.status !== WorkoutStatusEnum.draft && (
                <div data-self="center">
                  <SetDots sets={props.exercise.loggedSets} target={props.exercise.target.sets} />
                </div>
              )}
          </div>
        </div>

        {skipped && (
          <Chip data-shrink="0" muted>
            {t("workout.exercise.skipped")}
          </Chip>
        )}

        {!(mobile || skipped) &&
          props.exercise.target &&
          props.workout.status !== WorkoutStatusEnum.draft && (
            <SetDots sets={props.exercise.loggedSets} target={props.exercise.target.sets} />
          )}

        {actions}
      </div>

      {workoutExerciseDescription.on && (
        <div
          className="c-prose"
          data-color="neutral-300"
          data-fs="sm"
          data-md-pl="0"
          data-pl="12"
          {...workoutExerciseDescription.props.target}
        >
          {props.exercise.exerciseDescription}
        </div>
      )}

      {workoutExerciseTarget.on && props.exercise.actions.targetSet.available && (
        <div data-md-pl="8" data-pl="12">
          <WorkoutExerciseTargetSet
            action={props.exercise.actions.targetSet}
            exercise={props.exercise}
            workout={props.workout}
            {...workoutExerciseTarget}
          />
        </div>
      )}

      {expandable && workoutExerciseVisibility.on && (
        <div
          data-gap="0"
          data-md-pl="0"
          data-pl="12"
          data-stack="y"
          {...workoutExerciseVisibility.props.target}
        >
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
    </HairlineRow>
  );
}
