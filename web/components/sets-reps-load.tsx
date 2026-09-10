import { useTranslations } from "@bgord/ui";
import { WeightFormat } from "../services/weight-format";

export function SetsRepsLoad(props: { sets: number; reps: number; load: number }) {
  const t = useTranslations();

  return (
    <span>
      {t("exercise.sets_reps_load", {
        sets: props.sets,
        reps: props.reps,
        load: WeightFormat.kilograms(props.load),
      })}
    </span>
  );
}
