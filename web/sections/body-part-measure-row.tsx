import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import type { BodyPartSummary } from "../../modules/measurements/value-objects/body-part-summary";
import * as ui from "../components";
import { bodyPartsRoute } from "../router";
import { DateFormat } from "../services/date-format";
import { LengthFormat } from "../services/length-format";

export function BodyPartMeasureRow(
  props: BodyPartSummary & { first: boolean; measuredOn: string | undefined },
) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const router = useRouter();

  const [latest] = props.measurements;

  const value = bg.useNumberField({
    name: props.id,
    defaultValue: latest ? LengthFormat.centimeters(latest.value) : undefined,
  });
  const same = latest !== undefined && value.value === LengthFormat.centimeters(latest.value);
  const typed = !same && value.value !== undefined ? LengthFormat.millimeters(value.value) : null;

  const mutation = bg.useMutation({
    autoResetDelayMs: 3000,
    perform: () =>
      fetch(`/api/measurements/body-part/${props.id}/measure`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          value: LengthFormat.millimeters(value.value ?? 0),
          measuredOn: props.measuredOn,
        }),
      }),
    onSuccess: async () => {
      await router.invalidate({ filter: (match) => match.routeId === bodyPartsRoute.id, sync: true });
    },
  });

  return (
    <ui.HairlineRow first={props.first} tone="subtle" {...ui.Spacing.rowCompact}>
      <form
        aria-busy={mutation.isLoading}
        data-cross="center"
        data-stack="x"
        data-wrap="wrap"
        onSubmit={mutation.handleSubmit}
        {...ui.Gap.related}
      >
        <div data-grow="1" data-minw="0" data-stack="y" {...ui.Gap.inline}>
          <span data-color={typed !== null ? "neutral-0" : "neutral-300"} data-transform="truncate">
            {props.name}
          </span>

          <small data-color="neutral-600">
            {latest
              ? DateFormat.plainDay(language, latest.measuredOn)
              : t("measurements.body_parts.measure.never")}
          </small>
        </div>

        {typed !== null && <ui.LengthDelta current={typed} data-fs="xs" previous={latest?.value} />}

        <ui.Stepper
          disabled={mutation.isLoading}
          field={value}
          label={t("measurements.body_parts.measure.value.label", { name: props.name })}
          max={300}
          min={0.1}
          step={0.1}
          unit={t("measurements.body_parts.measure.unit")}
          variant="compact"
          width={72}
        >
          <ui.StepperSubmit
            aria-label={t("measurements.body_parts.measure.cta")}
            disabled={
              (same && latest?.measuredOn === props.measuredOn) ||
              value.empty ||
              !props.measuredOn ||
              mutation.isLoading
            }
            title={t("measurements.body_parts.measure.cta")}
          />
        </ui.Stepper>

        {mutation.isDone && (
          <output data-main="end" data-pb="2" data-stack="x" data-tone="positive" data-width="100%">
            {t("measurements.body_parts.measure.saved")}
          </output>
        )}

        {mutation.isError && (
          <output aria-live="assertive" data-tone="danger" data-width="100%">
            {t("measurements.body_parts.measure.error")}
          </output>
        )}
      </form>
    </ui.HairlineRow>
  );
}
