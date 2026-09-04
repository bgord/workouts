import { useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import type { RepsType } from "../../modules/plans/value-objects/reps";
import type { WorkoutExerciseWithSets } from "../../modules/workouts/value-objects/workout";
import { ExerciseImage, ExerciseImageSize } from "./exercise-image";

function format(reps: RepsType): string {
  return reps.min === reps.max ? String(reps.min) : `${reps.min}-${reps.max}`;
}

export function WorkoutExerciseRow(props: {
  exercise: WorkoutExerciseWithSets;
  skipped?: boolean;
  children?: React.ReactNode;
}) {
  const t = useTranslations();

  const exercise = { id: props.exercise.exerciseId, name: props.exercise.exerciseName };

  return (
    <li
      className="exercise-block"
      data-bc="neutral-800"
      data-bg="neutral-900"
      data-br="md"
      data-bs="solid"
      data-bw="hairline"
      data-gap="2"
      data-hover-bc="neutral-700"
      data-p="3"
      data-pl="4"
      data-stack="y"
    >
      <div data-cross="center" data-gap="3" data-stack="x">
        <Link
          aria-hidden
          params={{ exerciseId: props.exercise.exerciseId }}
          tabIndex={-1}
          to="/catalog/exercise/$exerciseId"
        >
          <ExerciseImage exercise={exercise} size={ExerciseImageSize.sm} />
        </Link>

        <Link
          className="c-link"
          data-maxw="100%"
          data-transform="truncate"
          params={{ exerciseId: props.exercise.exerciseId }}
          title={props.exercise.exerciseName}
          to="/catalog/exercise/$exerciseId"
        >
          {props.exercise.exerciseName}
        </Link>

        <div data-color="neutral-500" data-fs="sm" data-ls="wide" data-ml="auto">
          {t("workout.exercise.prescription", {
            sets: props.exercise.prescription.sets,
            reps: format(props.exercise.prescription.reps),
          })}
        </div>

        {props.exercise.target && (
          <div
            data-bc="brand-800"
            data-bg="brand-900"
            data-br="pill"
            data-bs="solid"
            data-bw="hairline"
            data-color="brand-200"
            data-fs="xs"
            data-fw="medium"
            data-lh="none"
            data-px="2"
            data-py="1"
            data-skipped={props.skipped}
            data-transform="nowrap"
          >
            {t("workout.exercise.target", {
              sets: props.exercise.target.sets,
              reps: props.exercise.target.reps,
              load: props.exercise.target.load / 1000,
            })}
          </div>
        )}
      </div>

      {props.skipped && (
        <div className="skipped" data-color="neutral-500" data-fs="sm" data-ls="wide" data-px="2" data-py="1">
          {t("workout.exercise.skipped")}
        </div>
      )}

      {props.children}
    </li>
  );
}
