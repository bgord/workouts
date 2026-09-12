import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Scale } from "lucide-react";
import { useRef } from "react";
import { ButtonClear } from "../components/button-clear";
import { measurementsRoute } from "../router";
import * as ShortcutDefinitions from "../services/shortcuts";
import { BodyWeightDecimals, WeightFormat } from "../services/weight-format";

export function BodyWeightMeasure() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { measurements } = measurementsRoute.useLoaderData();
  const latest = measurements[0];

  const today = new Date().toISOString().slice(0, 10);
  const measuredOn = bg.useDateField({ name: "body-weight-measured-on", defaultValue: today });
  const weight = bg.useNumberField({
    name: "body-weight",
    defaultValue: latest ? WeightFormat.kilograms(latest.weight, BodyWeightDecimals) : undefined,
  });
  const weightInput = useRef<HTMLInputElement>(null);

  bg.useShortcuts({
    [ShortcutDefinitions.LogBodyWeight.trigger]: (event) => {
      event.preventDefault();
      weightInput.current?.focus();
    },
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/measurements/body-weight/measure", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ measuredOn: measuredOn.value, weight: WeightFormat.grams(weight.value ?? 0) }),
      }),
    onSuccess: async () => {
      await router.invalidate({ filter: (route) => route.id === measurementsRoute.id, sync: true });
    },
  });

  return (
    <form
      className="c-card"
      data-cross="end"
      data-gap="3"
      data-md-cross="start"
      data-md-p="2-5"
      data-md-stack="y"
      data-stack="x"
      data-variant="flat"
      onSubmit={mutation.handleSubmit}
    >
      <div data-gap="1" data-md-width="100%" data-stack="y">
        <label className="c-label" {...measuredOn.label.props}>
          {t("measurements.body_weight.measure.date.label")}
        </label>

        <input
          className="c-input"
          data-md-width="100%"
          data-variant="transparent"
          type="date"
          {...measuredOn.input.props}
          max={today}
        />
      </div>

      <div data-gap="1" data-md-width="100%" data-stack="y">
        <label className="c-label" {...weight.label.props}>
          {t("measurements.body_weight.measure.weight.label")}
        </label>

        <input
          className="c-input"
          data-md-width="100%"
          data-variant="transparent"
          min="0"
          ref={weightInput}
          step="0.05"
          type="number"
          {...weight.input.props}
        />
      </div>

      <div data-gap="2" data-md-width="100%" data-stack="x">
        <button
          className="c-button"
          data-md-grow="1"
          data-variant="secondary"
          disabled={measuredOn.empty || weight.empty || mutation.isLoading}
          type="submit"
        >
          <Scale data-size="sm" />
          {t("measurements.body_weight.measure.cta")}
        </button>

        <ButtonClear
          data-md-grow="1"
          disabled={measuredOn.unchanged && weight.unchanged}
          onClick={bg.exec([measuredOn.clear, weight.clear])}
        />
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm" data-mb="2">
          {t("measurements.body_weight.measure.error")}
        </output>
      )}
    </form>
  );
}
