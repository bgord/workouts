import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import * as ui from "../components";
import { measurementsRoute } from "../router";
import { BodyWeightDecimals, WeightFormat } from "../services/weight-format";

const date = { flexShrink: 0, minWidth: 0, width: "auto" };
const submit = { ...bg.Rhythm(34).times(1).width, ...bg.Rhythm(34).times(1).height };

export function BodyWeightMeasurementCorrect(
  props: { measurement: BodyWeightMeasurement } & bg.UseToggleReturnType,
) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { toggle } = bg.extractUseToggle(props);

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
      toggle.disable();
      await router.invalidate({ filter: (route) => route.id === measurementsRoute.id, sync: true });
    },
  });

  if (toggle.off) return null;

  return (
    <form
      aria-busy={mutation.isLoading}
      data-cross="center"
      data-grow="1"
      data-stack="x"
      data-wrap="wrap"
      onSubmit={mutation.handleSubmit}
      {...ui.Gap.inline}
      {...toggle.props.target}
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
      </ui.Stepper>

      <ui.IconButton
        aria-label={t("app.cancel")}
        onClick={bg.exec([measuredOn.clear, weight.clear, mutation.reset, toggle.disable])}
        title={t("app.cancel")}
      >
        <X data-size="sm" />
      </ui.IconButton>

      {mutation.isError && (
        <ui.Output data-width="100%">{t("measurements.body_weight.correct.error")}</ui.Output>
      )}
    </form>
  );
}
