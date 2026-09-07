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
    <li className="c-card" data-cross="start" data-gap="3" data-stack="x">
      <Link
        aria-hidden
        params={{ exerciseId: props.exercise.exerciseId }}
        tabIndex={-1}
        to="/catalog/exercise/$exerciseId"
      >
        <ExerciseImage exercise={exercise} size={ExerciseImageSize.sm} />
      </Link>

      <div data-gap="2" data-grow="1" data-stack="y" style={{ minInlineSize: 0 }}>
        <div data-cross="center" data-gap="3" data-stack="x">
          <Link
            className="c-card-title"
            data-hover-color="brand-300"
            data-transform="truncate"
            params={{ exerciseId: props.exercise.exerciseId }}
            style={{ minInlineSize: 0, textDecoration: "none" }}
            title={props.exercise.exerciseName}
            to="/catalog/exercise/$exerciseId"
          >
            {props.exercise.exerciseName}
          </Link>

          <div className="c-card-description" data-ls="wide" data-ml="auto" data-transform="nowrap">
            {t("workout.exercise.prescription", {
              sets: props.exercise.prescription.sets,
              reps: format(props.exercise.prescription.reps),
            })}
          </div>

          {props.exercise.target && (
            <div
              className="c-badge"
              data-transform="nowrap"
              data-variant={props.skipped ? "outline" : "primary"}
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

        {props.children}
      </div>
    </li>
  );
}
