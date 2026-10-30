import * as bg from "@bgord/ui";

export function DailyStepsValue(props: { count: number }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  return t("measurements.daily_steps.value", {
    steps: props.count.toLocaleString(language),
    count: props.count,
  });
}
