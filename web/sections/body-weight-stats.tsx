import { useLanguage, useTranslations } from "@bgord/ui";
import { CalendarRange, Scale, TrendingUp } from "lucide-react";
import type * as VO from "../../modules/measurements/value-objects/body-weight-stats";
import * as ui from "../components";
import { DateFormat } from "../services/date-format";

export function BodyWeightStats(props: VO.BodyWeightStats) {
  const t = useTranslations();
  const language = useLanguage();

  const { latest, previous, reference, baseline, week, previousWeek } = props;
  const goal = reference?.goal;

  const day = (iso: string) => DateFormat.dayWithWeekday(language, Temporal.PlainDate.from(iso));

  return (
    <ul data-stack="x" data-wrap="wrap" {...ui.Gap.related}>
      <ui.Tile>
        <ui.TileHeader>
          <Scale data-size="xs" />
          {t("measurements.body_weight.stats.latest")}
        </ui.TileHeader>

        <ui.TileValue>
          <ui.BodyWeightValue weight={latest.weight} />

          <ui.BodyWeightDelta current={latest.weight} data-fs="xs" goal={goal} previous={previous?.weight} />
        </ui.TileValue>

        <ui.TileContext>{day(latest.measuredOn)}</ui.TileContext>
      </ui.Tile>

      <ui.Tile>
        <ui.TileHeader>
          <CalendarRange data-size="xs" />
          {t("measurements.body_weight.stats.week_average")}
        </ui.TileHeader>

        <ui.TileValue>
          <ui.BodyWeightValue weight={week.average} />

          <ui.BodyWeightDelta
            current={week.average}
            data-fs="xs"
            goal={goal}
            previous={previousWeek?.average}
          />
        </ui.TileValue>

        <ui.TileContext>
          {t("measurements.body_weight.stats.week_average.count", { count: week.count })}
        </ui.TileContext>
      </ui.Tile>

      <ui.Tile>
        <ui.TileHeader>
          {goal ? <ui.BodyWeightGoalIcon goal={goal} size="xs" /> : <TrendingUp data-size="xs" />}
          {t(
            reference
              ? "measurements.body_weight.stats.since_reference"
              : "measurements.body_weight.stats.since_first",
          )}
        </ui.TileHeader>

        <ui.TileValue>
          {latest.weight === baseline.weight ? (
            <ui.BodyWeightValue weight={0} />
          ) : (
            <ui.BodyWeightDelta current={latest.weight} goal={goal} previous={baseline.weight} />
          )}
        </ui.TileValue>

        <ui.TileContext>
          {goal
            ? t("measurements.body_weight.stats.since_reference.goal", {
                goal: t(`measurements.body_weight.goal.${goal}`),
                date: day(baseline.measuredOn),
              })
            : day(baseline.measuredOn)}
        </ui.TileContext>
      </ui.Tile>
    </ul>
  );
}
