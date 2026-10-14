import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import type { StepsCountType } from "../../modules/measurements/value-objects/steps-count";
import { StepsCountMax } from "../../modules/measurements/value-objects/steps-count.validation";
import * as ui from "../components";
import { dailyStepsRoute } from "../router";

export function DailyStepsGoalSet(props: { goal: StepsCountType | null }) {
  const t = bg.useTranslations();
  const router = useRouter();

  const goal = bg.useNumberField<number>({ name: "daily-steps-goal", defaultValue: props.goal ?? undefined });

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/measurements/daily-steps/goal", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ goal: goal.value ?? 0 }),
      }),
    onSuccess: async () => {
      await router.invalidate({ filter: (match) => match.routeId === dailyStepsRoute.id, sync: true });
    },
  });

  return (
    <form
      aria-busy={mutation.isLoading}
      aria-label={t("measurements.daily_steps.goal.label")}
      data-cross="center"
      data-ml="auto"
      data-stack="x"
      data-wrap="wrap"
      onSubmit={mutation.handleSubmit}
      {...ui.Gap.inline}
    >
      <label data-color="neutral-300" data-fs="sm" {...goal.label.props}>
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
        variant="compact"
        width={72}
      >
        <ui.StepperSubmit
          aria-label={t("app.save")}
          disabled={bg.Fields.anyEmpty([goal]) || bg.Fields.allUnchanged([goal]) || mutation.isLoading}
          title={t("app.save")}
        />
      </ui.Stepper>

      {mutation.isError && (
        <output aria-live="assertive" data-tone="danger" data-width="100%">
          {t("measurements.daily_steps.goal.error")}
        </output>
      )}
    </form>
  );
}
