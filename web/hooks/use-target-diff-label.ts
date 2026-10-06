import * as bg from "@bgord/ui";
import { WeightFormat } from "../services/weight-format";

const sign = (value: number, language: string) =>
  value > 0 ? `+${value.toLocaleString(language)}` : `−${Math.abs(value).toLocaleString(language)}`;

export function useTargetDiffLabel() {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const pluralize = bg.usePluralize();

  const noun = (key: "sets" | "reps", value: number) =>
    t(`workout.previous_performance.diff.${key}`, {
      value: sign(value, language),
      noun: pluralize({
        value: Math.abs(value),
        singular: t(`workout.previous_performance.diff.${key}.noun.singular`),
        plural: t(`workout.previous_performance.diff.${key}.noun.plural`),
        genitive: t(`workout.previous_performance.diff.${key}.noun.genitive`),
      }),
    });

  return {
    sets: (value: number) => noun("sets", value),
    reps: (value: number) => noun("reps", value),
    load: (value: number) =>
      t("workout.previous_performance.diff.load", { value: sign(WeightFormat.kilograms(value), language) }),
  };
}
