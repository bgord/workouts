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

  const [latest] = props.measurements;
  const typed = LengthFormat.parse(props.value);

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
        field={{
          value: typed === null ? undefined : LengthFormat.centimeters(typed),
          set: (next) => props.onChange(next === undefined ? "" : String(next)),
          input: {
            props: {
              id: `body-part-measure-${props.id}`,
              name: `body-part-measure-${props.id}`,
              value: props.value,
              onChange: (event) => props.onChange(event.currentTarget.value),
            },
          },
        }}
        label={t("measurements.body_parts.measure.value.label", { name: props.name })}
        max={300}
        min={0.1}
        origin={latest ? LengthFormat.centimeters(latest.value) : undefined}
        placeholder={latest ? LengthFormat.centimeters(latest.value).toFixed(1) : "—"}
        step={0.1}
        unit={t("measurements.body_parts.measure.unit")}
        variant="compact"
        width={72}
      />
    </ui.HairlineRow>
  );
}
