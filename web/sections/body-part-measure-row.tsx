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

        {latest ? (
          <small data-cross="center" data-stack="x" {...ui.Gap.cluster}>
            <span
              data-bg="alpha-subtle"
              data-br="sm"
              data-color="neutral-300"
              data-fw="medium"
              data-px="1-5"
              data-transform="font-variant-numeric"
            >
              <ui.LengthValue millimeters={latest.value} />
            </span>

            <span data-color="neutral-600">{DateFormat.daysAgo(language, latest.measuredOn)}</span>
          </small>
        ) : (
          <small data-color="neutral-600">{t("measurements.body_parts.measure.never")}</small>
        )}
      </div>

      {typed !== null && <ui.LengthDelta current={typed} data-fs="xs" previous={latest?.value} />}

      <ui.LengthInput
        aria-label={t("measurements.body_parts.measure.value.label", { name: props.name })}
        disabled={props.disabled}
        onChange={(event) => props.onChange(event.currentTarget.value)}
        placeholder={latest ? LengthFormat.centimeters(latest.value).toFixed(1) : "—"}
        value={props.value}
      />
    </ui.HairlineRow>
  );
}
