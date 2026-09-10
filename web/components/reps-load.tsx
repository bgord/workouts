import { useTranslations } from "@bgord/ui";
import { WeightFormat } from "../services/weight-format";

export function RepsLoad(props: { reps: number; load: number; rir?: number }) {
  const t = useTranslations();

  if (props.rir !== undefined) {
    return (
      <span>
        {t("exercise.reps_load_rir", {
          reps: props.reps,
          load: WeightFormat.kilograms(props.load),
          rir: props.rir,
        })}
      </span>
    );
  }

  return (
    <span>{t("exercise.reps_load", { reps: props.reps, load: WeightFormat.kilograms(props.load) })}</span>
  );
}
