import * as bg from "@bgord/ui";
import { CalendarRange, Scale, TrendingUp } from "lucide-react";
import type * as VO from "../../modules/measurements/value-objects/body-weight-stats";
import * as ui from "../components";
import { DateFormat } from "../services/date-format";
import { BodyWeightDecimals } from "../services/weight-format";

export function BodyWeightStats(props: VO.BodyWeightStats) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  return (
    <ul data-stack="x" data-wrap="wrap" {...ui.Gap.related}>
      <ui.Tile>
        <ui.TileHeader>
          <Scale data-size="xs" />
          {t("measurements.body_weight.stats.latest")}
        </ui.TileHeader>

        <ui.TileValue>
          <ui.BodyWeightValue weight={props.latest.weight} />

          <ui.WeightDelta
            current={props.latest.weight}
            data-fs="xs"
            decimals={BodyWeightDecimals}
            goal={props.reference?.goal}
            previous={props.previous?.weight}
          />
        </ui.TileValue>

        <ui.TileContext>
          {DateFormat.dayWithWeekday(language, Temporal.PlainDate.from(props.latest.measuredOn))}
        </ui.TileContext>
      </ui.Tile>

      <ui.Tile>
        <ui.TileHeader>
          <CalendarRange data-size="xs" />
          {t("measurements.body_weight.stats.week_average")}
        </ui.TileHeader>

        <ui.TileValue>
          <ui.BodyWeightValue weight={props.week.average} />

          <ui.WeightDelta
            current={props.week.average}
            data-fs="xs"
            decimals={BodyWeightDecimals}
            goal={props.reference?.goal}
            previous={props.previousWeek?.average}
          />
        </ui.TileValue>

        <ui.TileContext>
          {t("measurements.body_weight.stats.week_average.count", { count: props.week.count })}
        </ui.TileContext>
      </ui.Tile>

      <ui.Tile>
        <ui.TileHeader>
          {props.reference?.goal ? (
            <ui.BodyWeightGoalIcon goal={props.reference?.goal} size="xs" />
          ) : (
            <TrendingUp data-size="xs" />
          )}
          {t(
            props.reference
              ? "measurements.body_weight.stats.since_reference"
              : "measurements.body_weight.stats.since_first",
          )}
        </ui.TileHeader>

        <ui.TileValue>
          {props.latest.weight === props.baseline.weight ? (
            <ui.BodyWeightValue weight={0} />
          ) : (
            <ui.WeightDelta
              current={props.latest.weight}
              decimals={BodyWeightDecimals}
              goal={props.reference?.goal}
              previous={props.baseline.weight}
            />
          )}
        </ui.TileValue>

        <ui.TileContext>
          {props.reference?.goal
            ? t("measurements.body_weight.stats.since_reference.goal", {
                goal: t(`measurements.body_weight.goal.${props.reference?.goal}`),
                date: DateFormat.dayWithWeekday(language, Temporal.PlainDate.from(props.baseline.measuredOn)),
              })
            : DateFormat.dayWithWeekday(language, Temporal.PlainDate.from(props.baseline.measuredOn))}
        </ui.TileContext>
      </ui.Tile>
    </ul>
  );
}
