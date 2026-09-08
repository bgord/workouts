import { useTranslations } from "@bgord/ui";
import type { ExercisePrescriptionType } from "../../modules/workouts/value-objects/exercise-prescription";

export function SetsReps(props: ExercisePrescriptionType) {
  const t = useTranslations();

  return (
    <span>
      {t("workout.exercise.prescription", {
        sets: props.sets,
        reps:
          props.reps.min === props.reps.max ? String(props.reps.min) : `${props.reps.min}-${props.reps.max}`,
      })}
    </span>
  );
}
