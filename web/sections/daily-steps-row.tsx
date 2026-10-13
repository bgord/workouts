import * as bg from "@bgord/ui";
import type { DailySteps } from "../../modules/measurements/value-objects/daily-steps";
import * as ui from "../components";
import { DailyStepsRemove } from "./daily-steps-remove";

export function DailyStepsRow(props: { entry: DailySteps; first: boolean }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  return (
    <ui.HairlineRow data-md-gap="2" data-stack="x" first={props.first} {...ui.Spacing.rowCompact}>
      <div
        data-color="neutral-300"
        data-grow="1"
        data-md-fs="xs"
        data-minw="0"
        data-stack="x"
        data-transform="nowrap"
      >
        <bg.DateTime format="list" value={props.entry.day} />
      </div>

      <div data-color="neutral-100" data-fw="medium" data-md-fs="xs" data-shrink="0" data-transform="nowrap">
        {t("measurements.daily_steps.value", { count: props.entry.count.toLocaleString(language) })}
      </div>

      <div data-shrink="0" data-stack="x" {...ui.Gap.inline}>
        <DailyStepsRemove entry={props.entry} />
      </div>
    </ui.HairlineRow>
  );
}
