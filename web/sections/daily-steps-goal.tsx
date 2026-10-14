import * as bg from "@bgord/ui";
import { Pencil, Plus, Target } from "lucide-react";
import * as ui from "../components";
import { dailyStepsRoute } from "../router";
import { DailyStepsGoalSet } from "./daily-steps-goal-set";

export function DailyStepsGoal() {
  const t = bg.useTranslations();
  const { goal } = dailyStepsRoute.useLoaderData();
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

        {goal !== null && (
          <strong data-color="neutral-0" data-fw="semibold" data-transform="font-variant-numeric">
            <ui.DailyStepsValue count={goal} />
          </strong>
        )}

        {goal === null && (
          <ui.StatusPanelDescription>{t("measurements.daily_steps.goal.empty")}</ui.StatusPanelDescription>
        )}
      </ui.StatusPanelText>

      {dailyStepsGoalSet.off && goal !== null && (
        <ui.IconButton
          aria-label={t("measurements.daily_steps.goal.edit")}
          onClick={dailyStepsGoalSet.enable}
          title={t("measurements.daily_steps.goal.edit")}
          {...dailyStepsGoalSet.props.controller}
        >
          <Pencil data-size="sm" />
        </ui.IconButton>
      )}

      {dailyStepsGoalSet.off && goal === null && (
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

      <DailyStepsGoalSet key={goal} {...dailyStepsGoalSet} />
    </ui.StatusPanel>
  );
}
