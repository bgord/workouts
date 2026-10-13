import * as bg from "@bgord/ui";
import { Calendar, CalendarRange, Footprints } from "lucide-react";
import type * as VO from "../../modules/measurements/value-objects/daily-steps-stats";
import * as ui from "../components";

export function DailyStepsStats(props: VO.DailyStepsStats) {
  const t = bg.useTranslations();
  const pluralize = bg.usePluralize();

  const days = (count: number) =>
    t("measurements.daily_steps.stats.average.count", {
      count,
      noun: pluralize({
        value: count,
        singular: t("measurements.daily_steps.stats.average.noun.singular"),
        plural: t("measurements.daily_steps.stats.average.noun.plural"),
        genitive: t("measurements.daily_steps.stats.average.noun.genitive"),
      }),
    });

  return (
    <ul data-cross="stretch" data-stack="x" data-wrap="wrap" {...ui.Gap.related}>
      <ui.Tile>
        <ui.TileHeader>
          <Footprints data-size="xs" />
          {t("measurements.daily_steps.stats.latest")}
        </ui.TileHeader>

        <ui.TileValue>
          <ui.DailyStepsValue count={props.latest.count} />
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
        </ui.TileValue>

        <ui.TileContext>{days(props.month.count)}</ui.TileContext>
      </ui.Tile>
    </ul>
  );
}
