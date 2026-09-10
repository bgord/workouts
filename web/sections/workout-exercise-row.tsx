import { useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
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

  const exercise = {
    id: props.exercise.exerciseId,
    name: props.exercise.exerciseName,
    imageEtag: props.exercise.exerciseImageEtag,
  };

  const skipped =
    props.workout.status === WorkoutStatusEnum.completed && props.exercise.loggedSets.length === 0;

  return (
    <li className="c-card">
      <div data-cross="center" data-gap="4" data-stack="x">
        <Link
          aria-hidden
          params={{ exerciseId: props.exercise.exerciseId }}
          tabIndex={-1}
          to="/catalog/exercise/$exerciseId"
        >
          <ExerciseImage size={ExerciseImageSize.sm} {...exercise} />
        </Link>

        <div data-gap="2" data-grow="1" data-stack="y">
          <Link
            className="c-card-title"
            data-hover-color="brand-300"
            data-transform="truncate"
            params={{ exerciseId: props.exercise.exerciseId }}
            title={props.exercise.exerciseName}
            to="/catalog/exercise/$exerciseId"
          >
            {props.exercise.exerciseName}
          </Link>

          <div data-cross="center" data-gap="3" data-stack="x">
            <div className="c-card-description" data-ls="wide" data-transform="nowrap">
              <SetsReps {...props.exercise.prescription} />
            </div>

            {props.exercise.target && (
              <div
                className="c-badge"
                data-color={skipped ? "neutral-400" : "neutral-200"}
                data-fs="sm"
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

        {props.exercise.actions.remove.available && (
          <WorkoutExerciseRemove
            action={props.exercise.actions.remove}
            exercise={props.exercise}
            workout={props.workout}
          />
        )}
      </div>

      {skipped && (
        <div
          className="c-card-description"
          data-bcl="alpha-medium"
          data-bsl="solid"
          data-bwl="thin"
          data-ls="wide"
          data-px="2"
          data-py="1"
        >
          {t("workout.exercise.skipped")}
        </div>
      )}

      <div data-gap="0" data-stack="y">
        <WorkoutSetList exercise={props.exercise} workout={props.workout} />

        {props.exercise.actions.targetSet.available && (
          <div className="c-card-footer" data-cross="end" data-gap="3">
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
