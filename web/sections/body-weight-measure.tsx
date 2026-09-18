import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import * as ui from "../components";
import { measurementsRoute } from "../router";
import * as ShortcutDefinitions from "../services/shortcuts";
import { BodyWeightDecimals, WeightFormat } from "../services/weight-format";

export function BodyWeightMeasure() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { measurements } = measurementsRoute.useLoaderData();

  const latest = measurements[0];
  const today = Temporal.Now.plainDateISO().toString();

  const measuredOn = bg.useDateField({ name: "body-weight-measured-on", defaultValue: today });
  const weight = bg.useNumberField({
    name: "body-weight",
    defaultValue: latest ? WeightFormat.kilograms(latest.weight, BodyWeightDecimals) : undefined,
  });

  bg.useShortcuts({
    [ShortcutDefinitions.LogBodyWeight.trigger]: (event) => {
      event.preventDefault();
      document.getElementById(weight.input.props.id)?.focus();
    },
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/measurements/body-weight/measure", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ measuredOn: measuredOn.value, weight: WeightFormat.grams(weight.value ?? 0) }),
      }),
    onSuccess: async () => {
      await router.invalidate({ filter: (route) => route.id === measurementsRoute.id, sync: true });
    },
  });

  return (
    <form
      aria-busy={mutation.isLoading}
      data-cross="center"
      data-stack="x"
      data-wrap="wrap"
      onSubmit={mutation.handleSubmit}
      {...ui.Gap.inline}
    >
      <label className="c-visually-hidden" {...measuredOn.label.props}>
        {t("measurements.body_weight.measure.date.label")}
      </label>

      <input
        className="c-input"
        data-minw="0"
        data-shrink="0"
        data-variant="transparent"
        data-width="auto"
        type="date"
        {...measuredOn.input.props}
        max={today}
      />

      <ui.Stepper
        disabled={mutation.isLoading}
        field={weight}
        label={t("measurements.body_weight.measure.weight.label")}
        max={500}
        min={0}
        step={0.05}
        unit={t("measurements.body_weight.measure.weight.unit")}
        width={72}
      >
        <ui.StepperSubmit
          aria-label={t("measurements.body_weight.measure.cta")}
          disabled={bg.Fields.anyEmpty([measuredOn, weight]) || mutation.isLoading}
          title={t("measurements.body_weight.measure.cta")}
        />
      </ui.Stepper>

      <ui.IconButton
        aria-label={t("app.clear")}
        data-disp={bg.Fields.allUnchanged([measuredOn, weight]) ? "none" : undefined}
        data-md-disp={bg.Fields.allUnchanged([measuredOn, weight]) ? "flex" : undefined}
        disabled={bg.Fields.allUnchanged([measuredOn, weight])}
        onClick={bg.exec([measuredOn.clear, weight.clear, mutation.reset])}
        title={t("app.clear")}
      >
        <X data-size="sm" />
      </ui.IconButton>

      {mutation.isError && (
        <ui.Output data-width="100%">{t("measurements.body_weight.measure.error")}</ui.Output>
      )}
    </form>
  );
}
