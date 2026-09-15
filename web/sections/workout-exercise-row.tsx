import { Rhythm, useToggle, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, Info, Target } from "lucide-react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";
import { ExerciseImage, ExerciseImageSize } from "../components/exercise-image";
import { SetDots } from "../components/set-dots";
import { SetsReps } from "../components/sets-reps";
import { SetsRepsLoad } from "../components/sets-reps-load";
import { usePersistedToggle } from "../hooks/use-persisted-toggle";
import { WorkoutExerciseRemove } from "./workout-exercise-remove";
import { WorkoutExerciseTargetSet } from "./workout-exercise-target-set";
import { WorkoutSetList } from "./workout-set-list";
import { WorkoutSetLog } from "./workout-set-log";

const body = { flexBasis: 0, minWidth: 0 };

export function WorkoutExerciseRow(props: {
  workout: Workout;
  exercise: WorkoutExercise;
  index: number;
  last: boolean;
}) {
  const t = useTranslations();

  const exercise = {
    id: props.exercise.exerciseId,
    name: props.exercise.exerciseName,
    imageEtag: props.exercise.exerciseImageEtag,
  };

  const completed = props.workout.status === WorkoutStatusEnum.completed;
  const skipped = completed && props.exercise.loggedSets.length === 0;

  const open = usePersistedToggle({
    name: `workout-exercise-${props.exercise.id}`,
    defaultValue: props.workout.status === WorkoutStatusEnum.draft,
  });
  const description = useToggle({ name: `workout-exercise-description-${props.exercise.id}` });

  return (
    <li
      data-bct={props.index === 0 ? undefined : "alpha-soft"}
      data-bst={props.index === 0 ? undefined : "solid"}
      data-bwt={props.index === 0 ? undefined : "hairline"}
      data-gap="2"
      data-pb={props.last ? undefined : "4"}
      data-pt={props.index === 0 ? undefined : "4"}
      data-stack="y"
    >
      <div data-cross="center" data-gap="3" data-md-gap="2" data-stack="x" data-wrap="nowrap">
        <button
          aria-label={open.on ? t("workout.exercise.collapse") : t("workout.exercise.expand")}
          data-color="neutral-400"
          data-cursor="pointer"
          data-hover-color="neutral-0"
          data-md-p="1"
          data-p="2-5"
          data-shrink="0"
          data-stack="x"
          onClick={open.toggle}
          title={open.on ? t("workout.exercise.collapse") : t("workout.exercise.expand")}
          type="button"
          {...open.props.controller}
        >
          {open.on ? <ChevronDown data-size="sm" /> : <ChevronRight data-size="sm" />}
        </button>

        <Link
          aria-hidden
          data-shrink="0"
          data-stack="x"
          params={{ exerciseId: props.exercise.exerciseId }}
          tabIndex={-1}
          to="/catalog/exercise/$exerciseId"
        >
          <ExerciseImage size={ExerciseImageSize.xs} {...exercise} />
        </Link>

        <div data-gap="1" data-grow="1" data-stack="y" style={body}>
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
            {props.exercise.target && (
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
                <Target data-color="brand-400" data-size="xs" />
                <SetsRepsLoad
                  load={props.exercise.target.load}
                  reps={props.exercise.target.reps}
                  sets={props.exercise.target.sets}
                />
              </div>
            )}

            <div
              data-color="neutral-500"
              data-fs="xs"
              data-md-disp={props.exercise.target ? "none" : undefined}
              data-transform="font-variant-numeric"
            >
              <SetsReps {...props.exercise.prescription} />
            </div>
          </div>
        </div>

        {skipped && (
          <div className="c-badge" data-color="neutral-400" data-shrink="0" data-variant="outline">
            {t("workout.exercise.skipped")}
          </div>
        )}

        {!skipped && props.exercise.target && props.workout.status !== WorkoutStatusEnum.draft && (
          <SetDots done={props.exercise.loggedSets.length} target={props.exercise.target.sets} />
        )}

        <div data-cross="center" data-gap="1" data-shrink="0" data-stack="x" data-wrap="nowrap">
          <button
            aria-label={t("workout.exercise.description.toggle")}
            className="c-button"
            data-color={description.on ? "neutral-0" : "neutral-500"}
            data-hover-color="neutral-0"
            data-px="0"
            data-variant="ghost"
            onClick={description.toggle}
            title={t("workout.exercise.description.toggle")}
            type="button"
            {...Rhythm().times(3).style.width}
            {...description.props.controller}
          >
            <Info data-size="sm" />
          </button>

          {props.exercise.actions.remove.available && (
            <WorkoutExerciseRemove
              action={props.exercise.actions.remove}
              exercise={props.exercise}
              workout={props.workout}
            />
          )}
        </div>
      </div>

      {description.on && (
        <div
          className="c-prose"
          data-color="neutral-300"
          data-fs="sm"
          data-md-pl="0"
          data-pl="12"
          {...description.props.target}
        >
          {props.exercise.exerciseDescription}
        </div>
      )}

      {open.on && (
        <div data-gap="0" data-md-pl="0" data-pl="12" data-stack="y" {...open.props.target}>
          <WorkoutSetList exercise={props.exercise} workout={props.workout} />

          {props.exercise.actions.targetSet.available && (
            <div data-cross="end" data-gap="3" data-pt="1">
              <WorkoutExerciseTargetSet
                action={props.exercise.actions.targetSet}
                exercise={props.exercise}
                workout={props.workout}
              />
            </div>
          )}

          {props.exercise.actions.setLog.available && (
            <WorkoutSetLog
              action={props.exercise.actions.setLog}
              exercise={props.exercise}
              workout={props.workout}
            />
          )}
        </div>
      )}
    </li>
  );
}
