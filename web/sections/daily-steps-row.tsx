import * as bg from "@bgord/ui";
import { ArrowDown } from "lucide-react";
import type { DailySteps } from "../../modules/measurements/value-objects/daily-steps";
import type { DailyStepsEntry } from "../../modules/measurements/value-objects/daily-steps-entry";
import type { StepsCountType } from "../../modules/measurements/value-objects/steps-count";
import * as ui from "../components";
import { DailyStepsCorrect } from "./daily-steps-correct";
import { DailyStepsRemove } from "./daily-steps-remove";

export function DailyStepsRow(props: {
  entry: DailyStepsEntry;
  previous: DailySteps | undefined;
  first: boolean;
  goal: StepsCountType | null;
}) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  const belowGoal = t("measurements.daily_steps.below_goal", {
    goal: props.goal?.toLocaleString(language) ?? "",
  });

  const dailyStepsCorrect = bg.useToggle({ name: `correct-${props.entry.day}` });

  return (
    <ui.HairlineRow data-md-gap="2" data-stack="x" first={props.first} {...ui.Spacing.rowCompact}>
      {dailyStepsCorrect.on && <DailyStepsCorrect entry={props.entry} {...dailyStepsCorrect} />}

      {!dailyStepsCorrect.on && (
        <>
          <button
            aria-label={t("measurements.daily_steps.correct.title")}
            data-color="neutral-300"
            data-cursor="pointer"
            data-grow="1"
            data-md-fs="xs"
            data-minw="0"
            data-stack="x"
            data-transform="nowrap"
            onClick={dailyStepsCorrect.enable}
            type="button"
            {...dailyStepsCorrect.props.controller}
          >
            <bg.DateTime format="list" value={props.entry.day} />
          </button>

          {props.entry.belowGoal && (
            <span
              aria-label={belowGoal}
              data-color="danger-400"
              data-self="center"
              role="img"
              title={belowGoal}
            >
              <ArrowDown data-size="xs" />
            </span>
          )}

          <button
            data-color="neutral-100"
            data-cursor="pointer"
            data-fw="medium"
            data-md-fs="xs"
            data-shrink="0"
            data-transform="nowrap"
            onClick={dailyStepsCorrect.enable}
            type="button"
            {...dailyStepsCorrect.props.controller}
          >
            <ui.DailyStepsValue count={props.entry.count} />
          </button>

          <div
            data-fs="xs"
            data-main="end"
            data-shrink="0"
            data-stack="x"
            {...bg.Rhythm(56).times(1).style.minWidth}
          >
            <ui.CountDelta current={props.entry.count} previous={props.previous?.count} />
          </div>

          <div data-shrink="0" data-stack="x" {...ui.Gap.inline}>
            <DailyStepsRemove entry={props.entry} />
          </div>
        </>
      )}
    </ui.HairlineRow>
  );
}
