// cSpell:ignore sparkline
import * as bg from "@bgord/ui";
import { CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import { Suspense } from "react";
import type { BodyPartSummary } from "../../modules/measurements/value-objects/body-part-summary";
import * as ui from "../components";
import { useBodyPartHistory } from "../hooks/use-body-part-history";
import { DateFormat } from "../services/date-format";
import { LengthFormat } from "../services/length-format";
import { BodyPartHistory, BodyPartHistoryLoading } from "./body-part-history";

export function BodyPartOverviewRow(props: BodyPartSummary & { first: boolean }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const bodyPartHistory = bg.useToggle({ name: `body-part-history-${props.id}` });
  const { history, load, reload } = useBodyPartHistory(props.id, props.latest?.id);

  const Chevron = bodyPartHistory.on ? ChevronUp : ChevronDown;

  return (
    <ui.HairlineRow first={props.first}>
      <button
        data-cross="center"
        data-cursor="pointer"
        data-hover-bg="alpha-subtle"
        data-px="3"
        data-stack="x"
        data-width="100%"
        disabled={!props.latest}
        onClick={bg.exec([load, bodyPartHistory.toggle])}
        onPointerEnter={props.latest ? load : undefined}
        type="button"
        {...bodyPartHistory.props.controller}
        {...ui.Spacing.rowCompact}
      >
        <span data-grow="1" data-minw="0" data-stack="y" {...ui.Gap.inline}>
          <span data-color="neutral-100" data-transform="truncate">
            {props.name}
          </span>

          {props.latest ? (
            <small data-color="neutral-600" data-cross="center" data-stack="x" {...ui.Gap.inline}>
              <CalendarDays data-size="xs" />
              {DateFormat.daysAgo(language, props.latest.measuredOn)}
            </small>
          ) : (
            <small data-color="neutral-600">{t("measurements.body_parts.measure.never")}</small>
          )}
        </span>

        <ui.Sparkline values={props.series.map((point) => point.value)} />

        {props.latest && <ui.LengthDelta data-fs="xs" millimeters={props.delta} />}

        <span
          data-color={props.latest ? "neutral-0" : "neutral-600"}
          data-fw="semibold"
          data-shrink="0"
          data-transform="font-variant-numeric"
          {...bg.Rhythm(72).times(1).style.minWidth}
          style={{ textAlign: "right" }}
        >
          {props.latest
            ? t("measurements.body_parts.value", {
                value: LengthFormat.centimeters(props.latest.value).toFixed(1),
              })
            : "—"}
        </span>

        <Chevron data-color={props.latest ? "neutral-500" : "neutral-700"} data-size="sm" />
      </button>

      {bodyPartHistory.on && history && (
        <ul
          data-pb="2"
          data-pr="3"
          data-pt="2"
          data-stack="y"
          {...ui.Spacing.inset}
          data-md-pl="3"
          {...bodyPartHistory.props.target}
        >
          <Suspense fallback={<BodyPartHistoryLoading />}>
            <BodyPartHistory history={history} onChange={reload} />
          </Suspense>
        </ul>
      )}
    </ui.HairlineRow>
  );
}
