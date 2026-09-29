import * as bg from "@bgord/ui";
import type { BodyPartSummary } from "../../modules/measurements/value-objects/body-part-summary";
import * as ui from "../components";
import { DateFormat } from "../services/date-format";
import { LengthFormat } from "../services/length-format";

export function BodyPartMeasureRow(props: BodyPartSummary & { first: boolean; disabled: boolean }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  const [latest] = props.measurements;

  const value = bg.useNumberField({
    name: props.id,
    defaultValue: latest ? LengthFormat.centimeters(latest.value) : undefined,
  });
  const typed = value.changed && value.value !== undefined ? LengthFormat.millimeters(value.value) : null;

  return (
    <ui.HairlineRow
      data-cross="center"
      data-stack="x"
      first={props.first}
      tone="subtle"
      {...ui.Spacing.rowCompact}
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
        disabled={props.disabled}
        field={value}
        label={t("measurements.body_parts.measure.value.label", { name: props.name })}
        max={300}
        min={0.1}
        step={0.1}
        unit={t("measurements.body_parts.measure.unit")}
        variant="compact"
        width={72}
      />
    </ui.HairlineRow>
  );
}
