import * as bg from "@bgord/ui";
import { WeightFormat } from "../services/weight-format";

export function SetsRepsLoad(props: { sets: number; reps: number; load: number }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  return (
    <span>
      {t("exercise.sets_reps_load", {
        sets: props.sets,
        reps: props.reps,
        load: WeightFormat.kilograms(props.load).toLocaleString(language),
      })}
    </span>
  );
}
