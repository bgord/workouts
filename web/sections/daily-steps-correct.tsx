import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { DailySteps } from "../../modules/measurements/value-objects/daily-steps";
import { StepsCountMax } from "../../modules/measurements/value-objects/steps-count.validation";
import * as ui from "../components";
import { dailyStepsRoute } from "../router";

export function DailyStepsCorrect(props: { entry: DailySteps } & bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const router = useRouter();

  const { toggle } = bg.extractUseToggle(props);

  const count = bg.useNumberField<number>({
    name: `corrected-daily-steps-count-${props.entry.day}`,
    defaultValue: props.entry.count,
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/measurements/daily-steps/record", {
        method: "POST",
        credentials: "include",
        headers: bg.TimeZoneOffset.get(),
        body: JSON.stringify({ day: props.entry.day, count: count.value ?? 0 }),
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
      aria-label={t("measurements.daily_steps.correct.title")}
      data-cross="center"
      data-grow="1"
      data-stack="x"
      data-wrap="wrap"
      onSubmit={mutation.handleSubmit}
      {...ui.Gap.related}
      {...toggle.props.target}
    >
      <div data-color="neutral-300" data-md-fs="xs" data-transform="nowrap">
        <bg.DateTime format="list" value={props.entry.day} />
      </div>

      <ui.Stepper
        aria-label={t("measurements.daily_steps.record.count.label")}
        disabled={mutation.isLoading}
        field={count}
        increment={500}
        max={StepsCountMax}
        min={0}
        step={1}
        unit={t("measurements.daily_steps.record.count.unit")}
        width={72}
      >
        <ui.StepperSubmit
          aria-label={t("app.save")}
          disabled={bg.Fields.anyEmpty([count]) || bg.Fields.allUnchanged([count]) || mutation.isLoading}
          title={t("app.save")}
        />
      </ui.Stepper>

      <ui.IconButton
        aria-label={t("app.cancel")}
        disabled={mutation.isLoading}
        onClick={bg.exec([count.clear, mutation.reset, toggle.disable])}
        title={t("app.cancel")}
      >
        <X data-size="sm" />
      </ui.IconButton>

      {mutation.isError && (
        <output aria-live="assertive" data-tone="danger" data-width="100%">
          {t("measurements.daily_steps.correct.error")}
        </output>
      )}
    </form>
  );
}
