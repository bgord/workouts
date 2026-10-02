import * as bg from "@bgord/ui";
import { BodyWeightDecimals, WeightFormat } from "../services/weight-format";

export function BodyWeightValue(props: { weight: number }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  return t("measurements.body_weight.value", {
    weight: WeightFormat.kilograms(props.weight, BodyWeightDecimals).toLocaleString(language),
  });
}
