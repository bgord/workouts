import { useLanguage, useTranslations } from "@bgord/ui";
import { CalendarRange, Scale, TrendingUp } from "lucide-react";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import * as ui from "../components";
import { DateFormat } from "../services/date-format";
import { BodyWeightDecimals, WeightFormat } from "../services/weight-format";

const ROLLING_WINDOW_DAYS = 7;

const average = (measurements: ReadonlyArray<BodyWeightMeasurement>) =>
  measurements.reduce((sum, measurement) => sum + measurement.weight, 0) / measurements.length;

export function BodyWeightStats(props: { measurements: ReadonlyArray<BodyWeightMeasurement> }) {
  const t = useTranslations();
  const language = useLanguage();

  const latest = props.measurements[0];
  const previous = props.measurements[1];
  const reference = props.measurements.find((measurement) => measurement.reference);
  const baseline = reference ?? props.measurements.at(-1);
  const goal = reference?.goal;

  if (!(latest && baseline)) return null;

  const anchor = Temporal.PlainDate.from(latest.measuredOn);
  const windowStart = anchor.subtract({ days: ROLLING_WINDOW_DAYS - 1 }).toString();
  const previousWindowStart = anchor.subtract({ days: ROLLING_WINDOW_DAYS * 2 - 1 }).toString();

  const window = props.measurements.filter((measurement) => measurement.measuredOn >= windowStart);
  const previousWindow = props.measurements.filter(
    (measurement) => measurement.measuredOn >= previousWindowStart && measurement.measuredOn < windowStart,
  );

  return (
    <ul data-stack="x" data-wrap="wrap" {...ui.Spacing.tiles}>
      <ui.Tile>
        <ui.TileHeader>
          <Scale data-size="xs" />
          {t("measurements.body_weight.stats.latest")}
        </ui.TileHeader>

        <ui.TileValue>
          {t("measurements.body_weight.value", {
            weight: WeightFormat.kilograms(latest.weight, BodyWeightDecimals),
          })}

          <ui.BodyWeightDelta current={latest.weight} data-fs="xs" goal={goal} previous={previous?.weight} />
        </ui.TileValue>

        <ui.TileContext>
          {DateFormat.dayWithWeekday(language, Temporal.PlainDate.from(latest.measuredOn))}
        </ui.TileContext>
      </ui.Tile>

      <ui.Tile>
        <ui.TileHeader>
          <CalendarRange data-size="xs" />
          {t("measurements.body_weight.stats.week_average")}
        </ui.TileHeader>

        <ui.TileValue>
          {t("measurements.body_weight.value", {
            weight: WeightFormat.kilograms(average(window), BodyWeightDecimals),
          })}

          {previousWindow.length > 0 && (
            <ui.BodyWeightDelta
              current={average(window)}
              data-fs="xs"
              goal={goal}
              previous={average(previousWindow)}
            />
          )}
        </ui.TileValue>

        <ui.TileContext>
          {t("measurements.body_weight.stats.week_average.count", { count: window.length })}
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
            t("measurements.body_weight.value", { weight: 0 })
          ) : (
            <ui.BodyWeightDelta current={latest.weight} goal={goal} previous={baseline.weight} />
          )}
        </ui.TileValue>

        <ui.TileContext>
          {goal
            ? t("measurements.body_weight.stats.since_reference.goal", {
                goal: t(`measurements.body_weight.goal.${goal}`),
                date: DateFormat.dayWithWeekday(language, Temporal.PlainDate.from(baseline.measuredOn)),
              })
            : DateFormat.dayWithWeekday(language, Temporal.PlainDate.from(baseline.measuredOn))}
        </ui.TileContext>
      </ui.Tile>
    </ul>
  );
}
