// cSpell:ignore sparkline
import * as bg from "@bgord/ui";
import type { BodyPartSummary } from "../../modules/measurements/value-objects/body-part-summary";
import * as ui from "../components";
import { DateFormat } from "../services/date-format";
import { BodyPartHistoryRow } from "./body-part-history-row";
import { BodyPartMeasure } from "./body-part-measure";

export function BodyPartOverviewRow(props: BodyPartSummary & { first: boolean }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const bodyPartHistory = bg.useToggle({ name: `body-part-history-${props.id}` });

  const [latest, previous] = props.measurements;

  return (
    <ui.HairlineRow data-stack="y" first={props.first} {...ui.Spacing.row} {...ui.Gap.related}>
      <div data-cross="center" data-stack="x" {...ui.Gap.related}>
        <ui.ChevronToggle
          disabled={!latest}
          label={t("app.details", { name: props.name })}
          {...bodyPartHistory}
        />

        <span data-grow="1" data-minw="0" data-stack="y" {...ui.Gap.inline}>
          <span data-color="neutral-100" data-transform="truncate">
            {props.name}
          </span>

          {latest ? (
            <small data-color="neutral-600" data-transform="nowrap">
              {DateFormat.plainDay(language, latest.measuredOn)}
            </small>
          ) : (
            <small data-color="neutral-600">{t("measurements.body_parts.measure.never")}</small>
          )}
        </span>

        <span data-md-disp="none" data-stack="x">
          <ui.Sparkline values={props.measurements.map((measurement) => measurement.value).toReversed()} />
        </span>

        <span
          data-fs="xs"
          data-main="end"
          data-shrink="0"
          data-stack="x"
          {...bg.Rhythm(56).times(1).style.minWidth}
        >
          {latest && <ui.LengthDelta current={latest.value} previous={previous?.value} />}
        </span>

        <span
          data-color={latest ? "neutral-0" : "neutral-600"}
          data-fw="semibold"
          data-main="end"
          data-shrink="0"
          data-stack="x"
          data-transform="font-variant-numeric"
          {...bg.Rhythm(72).times(1).style.minWidth}
        >
          {latest ? <ui.LengthValue millimeters={latest.value} /> : "—"}
        </span>

        <BodyPartMeasure {...props} />
      </div>

      {bodyPartHistory.on && (
        <ul data-stack="y" {...ui.Spacing.inset} {...bodyPartHistory.props.target}>
          {props.measurements.map((measurement, index) => (
            <BodyPartHistoryRow
              key={measurement.id}
              measurement={measurement}
              previous={props.measurements[index + 1]}
            />
          ))}
        </ul>
      )}
    </ui.HairlineRow>
  );
}
