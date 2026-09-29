import * as bg from "@bgord/ui";
import { Triangle } from "lucide-react";
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

  const typed = Number(props.value);
  const filled = props.value !== "" && typed > 0;
  const latest = props.latest ? LengthFormat.centimeters(props.latest.value) : null;
  const delta = filled && latest !== null ? Number((typed - latest).toFixed(1)) : null;

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

        {props.latest && latest !== null ? (
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

            <span data-color="neutral-600">{DateFormat.daysAgo(language, props.latest.measuredOn)}</span>
          </small>
        ) : (
          <small data-color="neutral-600">{t("measurements.body_parts.measure.never")}</small>
        )}
      </div>

      {delta !== null && (
        <span
          data-delta-pill={delta > 0 ? "up" : delta < 0 ? "down" : "same"}
          data-transform="font-variant-numeric"
        >
          {delta === 0 ? (
            t("measurements.body_parts.measure.same")
          ) : (
            <>
              <Triangle data-rotate={delta > 0 ? "0" : "180"} fill="currentColor" size={8} strokeWidth={0} />
              {t("measurements.body_parts.value", {
                value: `${delta > 0 ? "+" : "−"}${Math.abs(delta).toFixed(1)}`,
              })}
            </>
          )}
        </span>
      )}

      <input
        aria-label={t("measurements.body_parts.measure.value.label", { name: props.name })}
        className="c-input"
        data-shrink="0"
        data-spin="none"
        data-transform="font-variant-numeric"
        disabled={props.disabled}
        inputMode="decimal"
        min={0.1}
        onChange={(event) => props.onChange(event.currentTarget.value)}
        placeholder={latest !== null ? latest.toFixed(1) : "—"}
        step={0.1}
        style={{ ...bg.Rhythm(34).times(1).height, ...bg.Rhythm(88).times(1).width, textAlign: "right" }}
        type="number"
        value={props.value}
      />

      <small data-color="neutral-500">{t("measurements.body_parts.measure.unit")}</small>
    </ui.HairlineRow>
  );
}
