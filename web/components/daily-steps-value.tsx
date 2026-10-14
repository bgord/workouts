import * as bg from "@bgord/ui";

export function DailyStepsValue(props: { count: number }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const pluralize = bg.usePluralize();

  return t("measurements.daily_steps.value", {
    count: props.count.toLocaleString(language),
    noun: pluralize({
      value: props.count,
      singular: t("measurements.daily_steps.value.noun.singular"),
      plural: t("measurements.daily_steps.value.noun.plural"),
      genitive: t("measurements.daily_steps.value.noun.genitive"),
    }),
  });
}
