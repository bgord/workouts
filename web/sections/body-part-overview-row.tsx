// cSpell:ignore sparkline
import * as bg from "@bgord/ui";
import { CalendarDays } from "lucide-react";
import type { BodyPartSummary } from "../../modules/measurements/value-objects/body-part-summary";
import * as ui from "../components";
import { DateFormat } from "../services/date-format";
import { LengthFormat } from "../services/length-format";
import { BodyPartHistoryRow } from "./body-part-history-row";

export function BodyPartOverviewRow(props: BodyPartSummary & { first: boolean }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const bodyPartHistory = bg.useToggle({ name: `body-part-history-${props.id}` });

  const [latest] = props.measurements;

  return (
    <ui.HairlineRow data-stack="y" first={props.first} {...ui.Spacing.row}>
      <div data-cross="center" data-stack="x" {...ui.Gap.related}>
        <ui.ChevronToggle {...bodyPartHistory} disabled={!latest} />

        <span data-grow="1" data-minw="0" data-stack="y" {...ui.Gap.inline}>
          <span data-color="neutral-100" data-transform="truncate">
            {props.name}
          </span>

          {latest ? (
            <small data-color="neutral-600" data-cross="center" data-stack="x" {...ui.Gap.inline}>
              <CalendarDays data-size="xs" />
              {DateFormat.daysAgo(language, latest.measuredOn)}
            </small>
          ) : (
            <small data-color="neutral-600">{t("measurements.body_parts.measure.never")}</small>
          )}
        </span>

        <ui.Sparkline values={props.measurements.map((measurement) => measurement.value).toReversed()} />

        {latest && <ui.LengthDelta data-fs="xs" millimeters={latest.delta} />}

        <span
          data-color={latest ? "neutral-0" : "neutral-600"}
          data-fw="semibold"
          data-shrink="0"
          data-transform="font-variant-numeric"
          {...bg.Rhythm(72).times(1).style.minWidth}
          style={{ textAlign: "right" }}
        >
          {latest
            ? t("measurements.body_parts.value", { value: LengthFormat.centimeters(latest.value).toFixed(1) })
            : "—"}
        </span>
      </div>

      {bodyPartHistory.on && (
        <ul data-stack="y" {...ui.Spacing.inset} {...bodyPartHistory.props.target}>
          {props.measurements.map((measurement, index) => (
            <BodyPartHistoryRow first={index === 0} key={measurement.id} measurement={measurement} />
          ))}
        </ul>
      )}
    </ui.HairlineRow>
  );
}
