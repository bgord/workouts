import * as bg from "@bgord/ui";
import { WeightFormat } from "../services/weight-format";

const sign = (value: number) => (value > 0 ? `+${value}` : `−${Math.abs(value)}`);

export function useTargetDiffLabel() {
  const t = bg.useTranslations();
  const pluralize = bg.usePluralize();

  return {
    sets: (value: number) =>
      t("workout.previous_performance.diff.sets", {
        value: sign(value),
        noun: pluralize({
          value: Math.abs(value),
          singular: t("workout.previous_performance.diff.sets.noun.singular"),
          plural: t("workout.previous_performance.diff.sets.noun.plural"),
          genitive: t("workout.previous_performance.diff.sets.noun.genitive"),
        }),
      }),
    reps: (value: number) =>
      t("workout.previous_performance.diff.reps", {
        value: sign(value),
        noun: pluralize({
          value: Math.abs(value),
          singular: t("workout.previous_performance.diff.reps.noun.singular"),
          plural: t("workout.previous_performance.diff.reps.noun.plural"),
          genitive: t("workout.previous_performance.diff.reps.noun.genitive"),
        }),
      }),
    load: (value: number) =>
      t("workout.previous_performance.diff.load", { value: sign(WeightFormat.kilograms(value)) }),
  };
}
