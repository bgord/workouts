import * as bg from "@bgord/ui";
import type { BodyPartSummary } from "../../modules/measurements/value-objects/body-part-summary";
import * as ui from "../components";
import { DateFormat } from "../services/date-format";
import { LengthFormat } from "../services/length-format";

type BodyPartMeasureRowProps = BodyPartSummary & {
  value: string;
  onChange: (value: string) => void;
  first: boolean;
  disabled: boolean;
};

export function BodyPartMeasureRow(props: BodyPartMeasureRowProps) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  const [latestMeasurement] = props.measurements;
  const typed = Number(props.value);
  const filled = props.value !== "" && typed > 0;
  const latest = latestMeasurement ? LengthFormat.centimeters(latestMeasurement.value) : null;
  const delta =
    filled && latestMeasurement ? LengthFormat.millimeters(typed) - latestMeasurement.value : null;

  return (
    <ui.HairlineRow
      data-cross="center"
      data-stack="x"
      first={props.first}
      tone="subtle"
      {...ui.Spacing.rowCompact}
    >
      <div data-grow="1" data-minw="0" data-stack="y" {...ui.Gap.inline}>
        <span data-color={filled ? "neutral-0" : "neutral-300"} data-transform="truncate">
          {props.name}
        </span>

        {latestMeasurement && latest !== null ? (
          <small data-cross="center" data-stack="x" {...ui.Gap.cluster}>
            <span
              data-bg="alpha-subtle"
              data-br="sm"
              data-color="neutral-300"
              data-fw="medium"
              data-px="1-5"
              data-transform="font-variant-numeric"
            >
              {t("measurements.body_parts.value", { value: latest.toFixed(1) })}
            </span>

            <span data-color="neutral-600">{DateFormat.daysAgo(language, latestMeasurement.measuredOn)}</span>
          </small>
        ) : (
          <small data-color="neutral-600">{t("measurements.body_parts.measure.never")}</small>
        )}
      </div>

      {delta !== null && <ui.LengthDelta data-fs="xs" millimeters={delta} />}

      <ui.LengthInput
        aria-label={t("measurements.body_parts.measure.value.label", { name: props.name })}
        disabled={props.disabled}
        onChange={(event) => props.onChange(event.currentTarget.value)}
        placeholder={latest !== null ? latest.toFixed(1) : "—"}
        value={props.value}
      />
    </ui.HairlineRow>
  );
}
