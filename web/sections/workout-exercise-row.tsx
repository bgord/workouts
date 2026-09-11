import { useToggle, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Info, ListChecks } from "lucide-react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";
import { ExerciseImage, ExerciseImageSize } from "../components/exercise-image";
import { SetsReps } from "../components/sets-reps";
import { SetsRepsLoad } from "../components/sets-reps-load";
import { WorkoutExerciseRemove } from "./workout-exercise-remove";
import { WorkoutExerciseTargetSet } from "./workout-exercise-target-set";
import { WorkoutSetList } from "./workout-set-list";
import { WorkoutSetLog } from "./workout-set-log";

export function WorkoutExerciseRow(props: { workout: Workout; exercise: WorkoutExercise }) {
  const t = useTranslations();
  const description = useToggle({ name: `workout-exercise-description-${props.exercise.id}` });

  const exercise = {
    id: props.exercise.exerciseId,
    name: props.exercise.exerciseName,
    imageEtag: props.exercise.exerciseImageEtag,
  };

  const skipped =
    props.workout.status === WorkoutStatusEnum.completed && props.exercise.loggedSets.length === 0;

  const done = props.exercise.target ? props.exercise.loggedSets.length >= props.exercise.target.sets : false;

  return (
    <li className="c-card" data-gap="3" data-md-p="2-5" data-p="4">
      <div data-cross="center" data-gap="3" data-md-gap="2" data-stack="x" data-wrap="nowrap">
        <Link
          aria-hidden
          params={{ exerciseId: props.exercise.exerciseId }}
          tabIndex={-1}
          to="/catalog/exercise/$exerciseId"
        >
          <ExerciseImage size={ExerciseImageSize.sm} {...exercise} />
        </Link>

        <div data-gap="1" data-grow="1" data-stack="y" data-transform="truncate">
          <div data-cross="center" data-gap="0" data-stack="x" data-wrap="nowrap">
            <Link
              className="c-card-title"
              data-hover-color="brand-300"
              data-md-fs="sm"
              data-transform="truncate"
              params={{ exerciseId: props.exercise.exerciseId }}
              title={props.exercise.exerciseName}
              to="/catalog/exercise/$exerciseId"
            >
              {props.exercise.exerciseName}
            </Link>

            <button
              aria-label={t("workout.exercise.description.toggle")}
              className="c-button"
              data-color={description.on ? "neutral-0" : "neutral-500"}
              data-hover-color="neutral-0"
              data-shrink="0"
              data-variant="ghost"
              onClick={description.toggle}
              title={t("workout.exercise.description.toggle")}
              type="button"
              {...description.props.controller}
            >
              <Info data-size="sm" />
            </button>
          </div>

          <div data-cross="center" data-gap="2" data-stack="x">
            <div className="c-card-description" data-ls="wide" data-transform="nowrap">
              <SetsReps {...props.exercise.prescription} />
            </div>

            {props.exercise.target && (
              <div
                className="c-badge"
                data-color={skipped ? "neutral-400" : "neutral-200"}
                data-fs="xs"
                data-transform="nowrap"
                data-variant={skipped ? "outline" : "primary"}
              >
                <SetsRepsLoad
                  load={props.exercise.target.load}
                  reps={props.exercise.target.reps}
                  sets={props.exercise.target.sets}
                />
              </div>
            )}
          </div>
        </div>

        <div
          data-cross="center"
          data-md-cross="end"
          data-md-dir="column-reverse"
          data-md-gap="1"
          data-self="start"
          data-shrink="0"
          data-stack="x"
          data-wrap="nowrap"
        >
          {skipped && (
            <div className="c-badge" data-color="neutral-400" data-variant="outline">
              {t("workout.exercise.skipped")}
            </div>
          )}

          {!skipped && props.exercise.target && props.workout.status !== WorkoutStatusEnum.draft && (
            <div
              data-color={done ? "positive-400" : "neutral-500"}
              data-cross="center"
              data-fs="xs"
              data-gap="1"
              data-stack="x"
              data-wrap="nowrap"
              title={t("workout.set.progress.title")}
            >
              <ListChecks data-size="xs" />

              <span data-transform="font-variant-numeric">
                {t("workout.set.progress", {
                  done: props.exercise.loggedSets.length,
                  target: props.exercise.target.sets,
                })}
              </span>
            </div>
          )}

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
        <div className="c-prose" data-color="neutral-300" data-fs="sm" {...description.props.target}>
          {props.exercise.exerciseDescription}
        </div>
      )}

      <div data-gap="0" data-stack="y">
        <WorkoutSetList exercise={props.exercise} workout={props.workout} />

        {props.exercise.actions.targetSet.available && (
          <div className="c-card-footer" data-cross="end" data-gap="3" data-pt="3">
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
    </li>
  );
}
