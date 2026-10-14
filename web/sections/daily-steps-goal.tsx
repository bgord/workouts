import * as bg from "@bgord/ui";
import { Pencil, Plus, Target } from "lucide-react";
import type { DailyStepsGoalType } from "../../modules/measurements/value-objects/daily-steps-goal";
import * as ui from "../components";
import { DailyStepsGoalSet } from "./daily-steps-goal-set";

export function DailyStepsGoal(props: { goal: DailyStepsGoalType | null }) {
  const t = bg.useTranslations();
  const dailyStepsGoalSet = bg.useToggle({ name: "daily-steps-goal-set" });

  return (
    <ui.StatusPanel aria-label={t("measurements.daily_steps.goal.label")} role="group">
      <span
        aria-hidden
        data-br="sm"
        data-color="brand-300"
        data-p="2"
        data-shrink="0"
        data-stack="x"
        style={{ backgroundColor: "color-mix(in oklch, var(--color-brand-500) 15%, transparent)" }}
      >
        <Target data-size="sm" />
      </span>

      <ui.StatusPanelText data-grow="1">
        <small data-color="neutral-500" data-fs="xs" data-ls="wide" data-transform="uppercase">
          {t("measurements.daily_steps.goal.label")}
        </small>

        {props.goal !== null && (
          <strong data-color="neutral-0" data-fw="semibold" data-transform="font-variant-numeric">
            <ui.DailyStepsValue count={props.goal} />
          </strong>
        )}

        {props.goal === null && (
          <ui.StatusPanelDescription>{t("measurements.daily_steps.goal.empty")}</ui.StatusPanelDescription>
        )}
      </ui.StatusPanelText>

      {dailyStepsGoalSet.off && props.goal !== null && (
        <ui.IconButton
          aria-label={t("measurements.daily_steps.goal.edit")}
          onClick={dailyStepsGoalSet.enable}
          title={t("measurements.daily_steps.goal.edit")}
          {...dailyStepsGoalSet.props.controller}
        >
          <Pencil data-size="sm" />
        </ui.IconButton>
      )}

      {dailyStepsGoalSet.off && props.goal === null && (
        <button
          className="c-button"
          data-variant="ghost"
          onClick={dailyStepsGoalSet.enable}
          type="button"
          {...dailyStepsGoalSet.props.controller}
        >
          <Plus data-size="sm" />
          {t("measurements.daily_steps.goal.set")}
        </button>
      )}

      <DailyStepsGoalSet goal={props.goal} key={props.goal} {...dailyStepsGoalSet} />
    </ui.StatusPanel>
  );
}
