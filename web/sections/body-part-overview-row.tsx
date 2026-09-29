// cSpell:ignore sparkline
import * as bg from "@bgord/ui";
import { CalendarDays } from "lucide-react";
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
  const { history, load } = useBodyPartHistory(props.id);

  return (
    <ui.HairlineRow data-stack="y" first={props.first} {...ui.Spacing.row}>
      <div
        data-cross="center"
        data-stack="x"
        onPointerEnter={props.latest ? load : undefined}
        {...ui.Gap.related}
      >
        <ui.ChevronToggle
          {...bodyPartHistory}
          disabled={!props.latest}
          toggle={bg.exec([load, bodyPartHistory.toggle])}
        />

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
      </div>

      {bodyPartHistory.on && history && (
        <ul data-stack="y" {...ui.Spacing.inset} {...bodyPartHistory.props.target}>
          <Suspense fallback={<BodyPartHistoryLoading />}>
            <BodyPartHistory history={history} />
          </Suspense>
        </ul>
      )}
    </ui.HairlineRow>
  );
}
