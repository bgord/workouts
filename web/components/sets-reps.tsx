import * as bg from "@bgord/ui";
import type { ExercisePrescriptionType } from "../../modules/workouts/value-objects/exercise-prescription";

export function SetsReps(
  props: React.JSX.IntrinsicElements["span"] & Pick<ExercisePrescriptionType, "sets" | "reps">,
) {
  const t = bg.useTranslations();
  const { sets, reps, ...span } = props;

  return (
    <span {...span}>
      {t("exercise.sets_reps", {
        sets,
        reps: reps.min === reps.max ? String(reps.min) : `${reps.min}-${reps.max}`,
      })}
    </span>
  );
}
