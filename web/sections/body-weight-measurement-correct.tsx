import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, Pencil, X } from "lucide-react";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import { measurementsRoute } from "../router";
import { WeightFormat } from "../services/weight-format";

export function BodyWeightMeasurementCorrect(props: {
  measurement: BodyWeightMeasurement;
  toggle: bg.UseToggleReturnType;
}) {
  const t = bg.useTranslations();
  const router = useRouter();
  const edit = props.toggle;

  const measuredOn = bg.useDateField({
    name: `corrected-measured-on-${props.measurement.id}`,
    defaultValue: props.measurement.measuredOn,
  });

  const weight = bg.useNumberField({
    name: `corrected-weight-${props.measurement.id}`,
    defaultValue: WeightFormat.kilograms(props.measurement.weight),
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/measurements/body-weight/measurement/${props.measurement.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ measuredOn: measuredOn.value, weight: WeightFormat.grams(weight.value ?? 0) }),
      }),
    onSuccess: async () => {
      edit.disable();
      await router.invalidate({ filter: (route) => route.id === measurementsRoute.id, sync: true });
    },
  });

  if (edit.off) {
    return (
      <button
        className="c-button"
        data-variant="ghost"
        onClick={edit.enable}
        title={t("measurements.body_weight.correct.title")}
        type="button"
        {...edit.props.controller}
      >
        <Pencil data-size="sm" />
      </button>
    );
  }

  return (
    <form
      data-cross="center"
      data-gap="2"
      data-grow="1"
      data-stack="x"
      data-wrap="nowrap"
      onSubmit={mutation.handleSubmit}
      {...edit.props.target}
    >
      <input
        aria-label={t("measurements.body_weight.measure.date.label")}
        className="c-input"
        data-fs="sm"
        data-px="2"
        type="date"
        {...measuredOn.input.props}
        max={Temporal.Now.plainDateISO().toString()}
      />

      <input
        aria-label={t("measurements.body_weight.measure.weight.label")}
        className="c-input"
        data-px="2"
        min="0"
        step="0.1"
        type="number"
        {...weight.input.props}
        {...bg.Rhythm(80).times(1).style.width}
      />

      <button
        aria-label={t("app.save")}
        className="c-button"
        data-ml="auto"
        data-px="2"
        data-variant="secondary"
        disabled={
          measuredOn.empty || weight.empty || (measuredOn.unchanged && weight.unchanged) || mutation.isLoading
        }
        title={t("app.save")}
        type="submit"
      >
        <Check data-size="sm" />
      </button>

      <button
        aria-label={t("app.cancel")}
        className="c-button"
        data-px="2"
        data-variant="ghost"
        onClick={bg.exec([measuredOn.clear, weight.clear, mutation.reset, edit.disable])}
        title={t("app.cancel")}
        type="button"
      >
        <X data-size="sm" />
      </button>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("measurements.body_weight.correct.error")}
        </output>
      )}
    </form>
  );
}
