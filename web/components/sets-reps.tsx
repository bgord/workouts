import * as bg from "@bgord/ui";
import { RepsScheme } from "../../modules/plans/value-objects/reps-scheme";
import type { ExercisePrescriptionType } from "../../modules/workouts/value-objects/exercise-prescription";
import { RepsSchemeFormat } from "../kits/reps-scheme.format";

export function SetsReps(
  props: React.JSX.IntrinsicElements["span"] &
    Pick<ExercisePrescriptionType, "sets" | "reps"> & { rir?: number | null },
) {
  const t = bg.useTranslations();
  const { sets, reps, rir, ...span } = props;

  const prescription = RepsSchemeFormat[RepsScheme.of(reps)].prescription(reps);

  return (
    <span {...span}>
      {rir === undefined || rir === null
        ? t("exercise.sets_reps", { sets, reps: prescription })
        : t("exercise.sets_reps_rir", { sets, reps: prescription, rir })}
    </span>
  );
}
