import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { useState } from "react";
import type { BodyPartMeasurement } from "../../modules/measurements/value-objects/body-part-measurement";
import * as ui from "../components";
import { measurementsRoute } from "../router";
import { DateFormat } from "../services/date-format";
import { LengthFormat } from "../services/length-format";

export function BodyPartMeasurementCorrect(
  props: { measurement: BodyPartMeasurement; onSuccess: () => void } & bg.UseToggleReturnType,
) {
  const t = bg.useTranslations();
  const router = useRouter();

  const { toggle } = bg.extractUseToggle(props);

  const today = DateFormat.todayISO();
  const original = LengthFormat.centimeters(props.measurement.value).toFixed(1);

  const measuredOn = bg.useDateField({
    name: `corrected-body-part-measured-on-${props.measurement.id}`,
    defaultValue: props.measurement.measuredOn,
  });
  const [value, setValue] = useState(original);

  const typed = Number(value);
  const filled = value !== "" && typed > 0;
  const unchanged = measuredOn.value === props.measurement.measuredOn && value === original;

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/measurements/body-part/measurement/${props.measurement.id}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({
          bodyPartId: props.measurement.bodyPartId,
          measuredOn: measuredOn.value,
          value: LengthFormat.millimeters(typed),
        }),
      }),
    onSuccess: async () => {
      toggle.disable();
      await router.invalidate({ filter: (match) => match.routeId === measurementsRoute.id, sync: true });
      props.onSuccess();
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

      <ui.LengthInput
        aria-label={t("measurements.body_parts.correct.value.label")}
        disabled={mutation.isLoading}
        onChange={(event) => setValue(event.currentTarget.value)}
        value={value}
      />

      <ui.IconButton
        disabled={!(filled && measuredOn.value) || unchanged || mutation.isLoading}
        title={t("app.save")}
        tone="positive"
        type="submit"
      >
        <Check data-size="sm" />
      </ui.IconButton>

      <ui.IconButton
        disabled={mutation.isLoading}
        onClick={bg.exec([measuredOn.clear, mutation.reset, toggle.disable])}
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
