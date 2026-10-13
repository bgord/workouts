import * as bg from "@bgord/ui";

export function DailyStepsValue(props: { count: number }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  return t("measurements.daily_steps.value", { count: props.count.toLocaleString(language) });
}
