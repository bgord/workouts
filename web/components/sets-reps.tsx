import * as bg from "@bgord/ui";
import { RepsScheme } from "../../modules/plans/value-objects/reps-scheme";
import type { ExercisePrescriptionType } from "../../modules/workouts/value-objects/exercise-prescription";
import { RepsSchemeFormat } from "../kits/reps-scheme.format";

export function SetsReps(
  props: React.JSX.IntrinsicElements["span"] & Pick<ExercisePrescriptionType, "sets" | "reps">,
) {
  const t = bg.useTranslations();
  const { sets, reps, ...span } = props;

  return (
    <span {...span}>
      {t("exercise.sets_reps", { sets, reps: RepsSchemeFormat[RepsScheme.of(reps)].prescription(reps) })}
    </span>
  );
}
