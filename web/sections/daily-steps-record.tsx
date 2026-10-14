import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { DailySteps } from "../../modules/measurements/value-objects/daily-steps";
import { StepsCountMax } from "../../modules/measurements/value-objects/steps-count.validation";
import * as ui from "../components";
import { dailyStepsRoute } from "../router";
import * as ShortcutDefinitions from "../services/shortcuts";

export function DailyStepsRecord() {
  const { dailyStepsStats } = dailyStepsRoute.useLoaderData();

  const latest = dailyStepsStats?.latest;

  return <DailyStepsRecordForm key={latest?.count} latest={latest} />;
}

function DailyStepsRecordForm(props: { latest: DailySteps | undefined }) {
  const t = bg.useTranslations();
  const router = useRouter();

  const today = bg.useToday();

  const day = bg.useDateField({ name: "daily-steps-day", defaultValue: today.toString() });
  const count = bg.useNumberField<number>({
    name: "daily-steps-count",
    defaultValue: props.latest?.count,
  });

  bg.useShortcuts({
    [ShortcutDefinitions.LogDailySteps.trigger]: (event) => {
      event.preventDefault();
      document.getElementById(count.input.props.id)?.focus();
    },
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/measurements/daily-steps/record", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ day: day.value, count: count.value ?? 0 }),
      }),
    onSuccess: async () => {
      await router.invalidate({ filter: (match) => match.routeId === dailyStepsRoute.id, sync: true });
    },
  });

  const pristine = bg.Fields.allUnchanged([day, count]);

  return (
    <form
      aria-busy={mutation.isLoading}
      data-stack="x"
      data-wrap="wrap"
      onSubmit={mutation.handleSubmit}
      {...ui.Gap.inline}
    >
      <label className="c-visually-hidden" {...day.label.props}>
        {t("measurements.daily_steps.record.date.label")}
      </label>

      <ui.Stepper
        aria-label={t("measurements.daily_steps.record.count.label")}
        disabled={mutation.isLoading}
        field={count}
        leading={
          <input
            className="c-input"
            data-bcr="alpha-medium"
            data-br="none"
            data-bs="none"
            data-bsr="solid"
            data-bwr="hairline"
            data-focus-ring-offset="inset"
            data-minw="0"
            data-shrink="0"
            data-width="auto"
            type="date"
            {...day.input.props}
            max={today.toString()}
          />
        }
        max={StepsCountMax}
        min={0}
        step={500}
        unit={t("measurements.daily_steps.record.count.unit")}
        width={72}
      >
        <ui.StepperSubmit
          aria-label={t("measurements.daily_steps.record.cta")}
          disabled={bg.Fields.anyEmpty([day, count]) || mutation.isLoading}
          title={t("measurements.daily_steps.record.cta")}
        />
      </ui.Stepper>

      <ui.IconButton
        aria-label={t("app.clear")}
        data-disp={pristine ? "none" : undefined}
        data-md-disp={pristine ? "flex" : undefined}
        disabled={pristine}
        onClick={bg.exec([day.clear, count.clear, mutation.reset])}
        title={t("app.clear")}
      >
        <X data-size="sm" />
      </ui.IconButton>

      {mutation.isError && (
        <output aria-live="assertive" data-tone="danger" data-width="100%">
          {t("measurements.daily_steps.record.error")}
        </output>
      )}
    </form>
  );
}
