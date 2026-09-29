import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { BodyPartSummaryMeasurement } from "../../modules/measurements/value-objects/body-part-summary";
import * as ui from "../components";
import { bodyPartsRoute } from "../router";
import { DateFormat } from "../services/date-format";
import { LengthFormat } from "../services/length-format";

export function BodyPartMeasurementCorrect(
  props: { measurement: BodyPartSummaryMeasurement } & bg.UseToggleReturnType,
) {
  const t = bg.useTranslations();
  const router = useRouter();

  const { toggle } = bg.extractUseToggle(props);

  const today = DateFormat.todayISO();

  const measuredOn = bg.useDateField({
    name: `corrected-body-part-measured-on-${props.measurement.id}`,
    defaultValue: props.measurement.measuredOn,
  });
  const length = bg.useNumberField({
    name: `corrected-body-part-length-${props.measurement.id}`,
    defaultValue: LengthFormat.centimeters(props.measurement.value),
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/measurements/body-part/measurement/${props.measurement.id}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({
          bodyPartId: props.measurement.bodyPartId,
          measuredOn: measuredOn.value,
          value: LengthFormat.millimeters(length.value ?? 0),
        }),
      }),
    onSuccess: async () => {
      toggle.disable();
      await router.invalidate({ filter: (match) => match.routeId === bodyPartsRoute.id, sync: true });
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
        aria-label={t("measurements.body_parts.measure.date.label")}
        className="c-input"
        data-minw="0"
        data-shrink="0"
        data-width="auto"
        disabled={mutation.isLoading}
        type="date"
        {...measuredOn.input.props}
        max={today}
        style={bg.Rhythm(34).times(1).height}
      />

      <ui.Stepper
        disabled={mutation.isLoading}
        field={length}
        label={t("measurements.body_parts.correct.value.label")}
        max={300}
        min={0.1}
        step={0.1}
        unit={t("measurements.body_parts.measure.unit")}
        width={72}
      >
        <ui.StepperSubmit
          aria-label={t("app.save")}
          disabled={
            bg.Fields.anyEmpty([measuredOn, length]) ||
            bg.Fields.allUnchanged([measuredOn, length]) ||
            mutation.isLoading
          }
          title={t("app.save")}
        />
      </ui.Stepper>

      <ui.IconButton
        aria-label={t("app.cancel")}
        disabled={mutation.isLoading}
        onClick={bg.exec([measuredOn.clear, length.clear, mutation.reset, toggle.disable])}
        title={t("app.cancel")}
      >
        <X data-size="sm" />
      </ui.IconButton>

      {mutation.isError && (
        <output aria-live="assertive" data-tone="danger" data-width="100%">
          {t("measurements.body_parts.correct.error")}
        </output>
      )}
    </form>
  );
}
