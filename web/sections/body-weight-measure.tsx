import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Scale } from "lucide-react";
import { useRef } from "react";
import { ButtonClear } from "../components/button-clear";
import { measurementsRoute } from "../router";
import * as ShortcutDefinitions from "../services/shortcuts";
import { BodyWeightDecimals, WeightFormat } from "../services/weight-format";

const field = { ...bg.Rhythm(160).times(1).width, minWidth: 0 };

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
    <form data-cross="center" data-gap="2" data-stack="x" data-wrap="wrap" onSubmit={mutation.handleSubmit}>
      <div data-gap="2" data-md-grow="1" data-stack="x" data-wrap="nowrap">
        <label className="c-visually-hidden" {...measuredOn.label.props}>
          {t("measurements.body_weight.measure.date.label")}
        </label>

        <input
          className="c-input"
          data-md-grow="1"
          data-variant="transparent"
          style={field}
          type="date"
          {...measuredOn.input.props}
          max={today}
        />

        <label className="c-visually-hidden" {...weight.label.props}>
          {t("measurements.body_weight.measure.weight.label")}
        </label>

        <div
          data-cross="center"
          data-md-grow="1"
          data-position="relative"
          data-stack="x"
          data-wrap="nowrap"
          style={field}
        >
          <input
            className="c-input"
            data-grow="1"
            data-pr="8"
            data-spin="none"
            data-variant="transparent"
            min="0"
            ref={weightInput}
            step="0.05"
            style={{ minWidth: 0 }}
            type="number"
            {...weight.input.props}
          />

          <span
            data-color="neutral-500"
            data-fs="sm"
            data-pointer-events="none"
            data-position="absolute"
            data-right="3"
          >
            {t("measurements.body_weight.measure.weight.unit")}
          </span>
        </div>
      </div>

      <div data-gap="2" data-md-width="100%" data-stack="x" data-wrap="nowrap">
        <button
          className="c-button"
          data-md-grow="1"
          data-variant="primary"
          disabled={measuredOn.empty || weight.empty || mutation.isLoading}
          type="submit"
        >
          <Scale data-size="sm" />
          {t("measurements.body_weight.measure.cta")}
        </button>

        <ButtonClear
          disabled={measuredOn.unchanged && weight.unchanged}
          onClick={bg.exec([measuredOn.clear, weight.clear, mutation.reset])}
        />
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm" data-width="100%">
          {t("measurements.body_weight.measure.error")}
        </output>
      )}
    </form>
  );
}
