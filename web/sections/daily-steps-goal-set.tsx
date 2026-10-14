import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import type { StepsCountType } from "../../modules/measurements/value-objects/steps-count";
import { StepsCountMax } from "../../modules/measurements/value-objects/steps-count.validation";
import * as ui from "../components";
import { dailyStepsRoute } from "../router";

export function DailyStepsGoalSet(props: { goal: StepsCountType | null } & bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { toggle } = bg.extractUseToggle(props);

  const goal = bg.useNumberField<number>({ name: "daily-steps-goal", defaultValue: props.goal ?? undefined });

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/measurements/daily-steps/goal", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ goal: goal.value ?? 0 }),
      }),
    onSuccess: async () => {
      toggle.disable();
      await router.invalidate({ filter: (match) => match.routeId === dailyStepsRoute.id, sync: true });
    },
  });

  if (toggle.off) return null;

  return (
    <form
      aria-busy={mutation.isLoading}
      aria-label={t("measurements.daily_steps.goal.label")}
      data-cross="center"
      data-stack="x"
      data-width="100%"
      data-wrap="wrap"
      onSubmit={mutation.handleSubmit}
      {...ui.Gap.inline}
      {...toggle.props.target}
    >
      <label className="c-visually-hidden" {...goal.label.props}>
        {t("measurements.daily_steps.goal.label")}
      </label>

      <ui.Stepper
        aria-label={t("measurements.daily_steps.goal.label")}
        disabled={mutation.isLoading}
        field={goal}
        max={StepsCountMax}
        min={0}
        step={500}
        unit={t("measurements.daily_steps.record.count.unit")}
        width={72}
      />

      <ui.InlineEditActions
        disabled={goal.empty || goal.unchanged || mutation.isLoading}
        onCancel={bg.exec([goal.clear, mutation.reset, toggle.disable])}
      />

      {mutation.isError && (
        <output aria-live="assertive" data-tone="danger" data-width="100%">
          {t("measurements.daily_steps.goal.error")}
        </output>
      )}
    </form>
  );
}
