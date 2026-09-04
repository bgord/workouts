import { useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import type { RepsType } from "../../modules/plans/value-objects/reps";
import type { WorkoutExerciseWithSets } from "../../modules/workouts/value-objects/workout";
import { ExerciseImage, ExerciseImageSize } from "./exercise-image";

function format(reps: RepsType): string {
  return reps.min === reps.max ? String(reps.min) : `${reps.min}-${reps.max}`;
}

export function WorkoutExerciseRow(props: { exercise: WorkoutExerciseWithSets; children?: React.ReactNode }) {
  const t = useTranslations();

  const exercise = { id: props.exercise.exerciseId, name: props.exercise.exerciseName };

  return (
    <li className="exercise-block" data-gap="2" data-stack="y">
      <div data-cross="center" data-gap="3" data-stack="x">
        <Link
          aria-hidden
          params={{ exerciseId: props.exercise.exerciseId }}
          tabIndex={-1}
          to="/workbook/exercise/$exerciseId"
        >
          <ExerciseImage exercise={exercise} size={ExerciseImageSize.sm} />
        </Link>

        <Link
          className="c-link"
          data-maxw="100%"
          data-transform="truncate"
          params={{ exerciseId: props.exercise.exerciseId }}
          title={props.exercise.exerciseName}
          to="/workbook/exercise/$exerciseId"
        >
          {props.exercise.exerciseName}
        </Link>

        <div className="prescription" data-color="neutral-500" data-fs="sm" data-ml="auto">
          {t("workout.exercise.prescription", {
            sets: props.exercise.prescription.sets,
            reps: format(props.exercise.prescription.reps),
          })}
        </div>

        {props.exercise.target && (
          <div className="target" data-color="neutral-300" data-fs="sm" data-fw="medium">
            {t("workout.exercise.target", {
              sets: props.exercise.target.sets,
              reps: props.exercise.target.reps,
              load: props.exercise.target.load / 1000,
            })}
          </div>
        )}
      </div>

      {props.children}
    </li>
  );
}
