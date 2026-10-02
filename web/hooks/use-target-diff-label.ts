import * as bg from "@bgord/ui";
import { WeightFormat } from "../services/weight-format";

const sign = (value: number, language: string) =>
  value > 0 ? `+${value.toLocaleString(language)}` : `−${Math.abs(value).toLocaleString(language)}`;

export function useTargetDiffLabel() {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const pluralize = bg.usePluralize();

  return {
    sets: (value: number) =>
      t("workout.previous_performance.diff.sets", {
        value: sign(value, language),
        noun: pluralize({
          value: Math.abs(value),
          singular: t("workout.previous_performance.diff.sets.noun.singular"),
          plural: t("workout.previous_performance.diff.sets.noun.plural"),
          genitive: t("workout.previous_performance.diff.sets.noun.genitive"),
        }),
      }),
    reps: (value: number) =>
      t("workout.previous_performance.diff.reps", {
        value: sign(value, language),
        noun: pluralize({
          value: Math.abs(value),
          singular: t("workout.previous_performance.diff.reps.noun.singular"),
          plural: t("workout.previous_performance.diff.reps.noun.plural"),
          genitive: t("workout.previous_performance.diff.reps.noun.genitive"),
        }),
      }),
    load: (value: number) =>
      t("workout.previous_performance.diff.load", { value: sign(WeightFormat.kilograms(value), language) }),
  };
}
