import * as bg from "@bgord/ui";
import { Calendar, CalendarRange, Footprints } from "lucide-react";
import type * as VO from "../../modules/measurements/value-objects/daily-steps-stats";
import * as ui from "../components";

export function DailyStepsStats(props: VO.DailyStepsStats) {
  const t = bg.useTranslations();

  const days = (count: number) => t("measurements.daily_steps.stats.average.count", { count });

  return (
    <ul
      aria-label={t("measurements.daily_steps.header")}
      data-cross="stretch"
      data-stack="x"
      data-wrap="wrap"
      {...ui.Gap.related}
    >
      <ui.Tile>
        <ui.TileHeader>
          <Footprints data-size="xs" />
          {t("measurements.daily_steps.stats.latest")}
        </ui.TileHeader>

        <ui.TileValue>
          <ui.DailyStepsValue count={props.latest.count} />

          <ui.CountDelta current={props.latest.count} data-fs="xs" previous={props.previous?.count} />
        </ui.TileValue>

        <ui.TileContext>
          <bg.DateTime format="freshness" value={props.latest.day} />
        </ui.TileContext>
      </ui.Tile>

      <ui.Tile>
        <ui.TileHeader>
          <CalendarRange data-size="xs" />
          {t("measurements.daily_steps.stats.week_average")}
        </ui.TileHeader>

        <ui.TileValue>
          <ui.DailyStepsValue count={props.week.average} />

          <ui.CountDelta current={props.week.average} data-fs="xs" previous={props.previousWeek?.average} />
        </ui.TileValue>

        <ui.TileContext>{days(props.week.count)}</ui.TileContext>
      </ui.Tile>

      <ui.Tile>
        <ui.TileHeader>
          <Calendar data-size="xs" />
          {t("measurements.daily_steps.stats.month_average")}
        </ui.TileHeader>

        <ui.TileValue>
          <ui.DailyStepsValue count={props.month.average} />

          <ui.CountDelta current={props.month.average} data-fs="xs" previous={props.previousMonth?.average} />
        </ui.TileValue>

        <ui.TileContext>{days(props.month.count)}</ui.TileContext>
      </ui.Tile>
    </ul>
  );
}
