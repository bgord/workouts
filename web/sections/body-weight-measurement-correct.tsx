import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import { Stepper } from "../components";
import { measurementsRoute } from "../router";
import { BodyWeightDecimals, WeightFormat } from "../services/weight-format";

const date = { flexShrink: 0, minWidth: 0, width: "auto" };
const submit = { ...bg.Rhythm(34).times(1).width, ...bg.Rhythm(34).times(1).height };

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
    defaultValue: WeightFormat.kilograms(props.measurement.weight, BodyWeightDecimals),
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

  if (edit.off) return null;

  return (
    <form
      aria-busy={mutation.isLoading}
      data-cross="center"
      data-gap="1"
      data-grow="1"
      data-stack="x"
      data-wrap="wrap"
      onSubmit={mutation.handleSubmit}
      {...edit.props.target}
    >
      <input
        aria-label={t("measurements.body_weight.measure.date.label")}
        className="c-input"
        data-variant="transparent"
        style={date}
        type="date"
        {...measuredOn.input.props}
        max={Temporal.Now.plainDateISO().toString()}
      />

      <Stepper
        disabled={mutation.isLoading}
        field={weight}
        label={t("measurements.body_weight.measure.weight.label")}
        max={500}
        min={0}
        step={0.05}
        unit={t("measurements.body_weight.measure.weight.unit")}
        width={72}
      >
        <button
          aria-label={t("app.save")}
          data-bcl="neutral-800"
          data-bg="alpha-subtle"
          data-bsl="solid"
          data-bwl="hairline"
          data-color="positive-400"
          data-cross="center"
          data-cursor="pointer"
          data-disp="flex"
          data-hover-bg="alpha-soft"
          data-main="center"
          data-shrink="0"
          disabled={
            measuredOn.empty ||
            weight.empty ||
            (measuredOn.unchanged && weight.unchanged) ||
            mutation.isLoading
          }
          style={submit}
          title={t("app.save")}
          type="submit"
        >
          <Check data-size="sm" />
        </button>
      </Stepper>

      <button
        aria-label={t("app.cancel")}
        className="c-button"
        data-color="neutral-400"
        data-hover-color="neutral-0"
        data-px="0"
        data-shrink="0"
        data-variant="ghost"
        onClick={bg.exec([measuredOn.clear, weight.clear, mutation.reset, edit.disable])}
        title={t("app.cancel")}
        type="button"
        {...bg.Rhythm().times(3).style.width}
      >
        <X data-size="sm" />
      </button>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="xs" data-width="100%">
          {t("measurements.body_weight.correct.error")}
        </output>
      )}
    </form>
  );
}
