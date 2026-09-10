import { useTranslations } from "@bgord/ui";
import { WeightFormat } from "../services/weight-format";

export function RepsLoad(props: { reps: number; load: number }) {
  const t = useTranslations();

  return (
    <span>{t("exercise.reps_load", { reps: props.reps, load: WeightFormat.kilograms(props.load) })}</span>
  );
}
