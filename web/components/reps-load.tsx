import * as bg from "@bgord/ui";
import { WeightFormat } from "../services/weight-format";

export function RepsLoad(props: { reps: number; load: number }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  return (
    <span>
      {t("exercise.reps_load", {
        reps: props.reps,
        load: WeightFormat.kilograms(props.load).toLocaleString(language),
      })}
    </span>
  );
}
