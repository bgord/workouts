import { Rhythm, useLanguage, useTranslations } from "@bgord/ui";
import { CalendarRange, Scale, TrendingUp } from "lucide-react";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import { DeltaKg } from "../components/delta-kg";
import { DateFormat } from "../services/date-format";
import { BodyWeightDecimals, WeightFormat } from "../services/weight-format";

const TILE_MIN_WIDTH = 168;
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

  if (!(latest && baseline)) return null;

  const anchor = Temporal.PlainDate.from(latest.measuredOn);
  const windowStart = anchor.subtract({ days: ROLLING_WINDOW_DAYS - 1 }).toString();
  const previousWindowStart = anchor.subtract({ days: ROLLING_WINDOW_DAYS * 2 - 1 }).toString();

  const window = props.measurements.filter((measurement) => measurement.measuredOn >= windowStart);
  const previousWindow = props.measurements.filter(
    (measurement) => measurement.measuredOn >= previousWindowStart && measurement.measuredOn < windowStart,
  );

  return (
    <ul data-gap="3" data-stack="x" data-wrap="wrap">
      <li
        className="c-card"
        data-cross="center"
        data-gap="1"
        data-grow="1"
        data-md-width="100%"
        data-p="4"
        data-stack="y"
        {...Rhythm(TILE_MIN_WIDTH).times(1).style.minWidth}
      >
        <div
          data-color="neutral-500"
          data-cross="center"
          data-fs="xs"
          data-gap="1-5"
          data-ls="wide"
          data-stack="x"
          data-transform="uppercase"
        >
          <Scale data-color="brand-400" data-size="xs" />
          {t("measurements.body_weight.stats.latest")}
        </div>

        <div
          data-color="neutral-0"
          data-cross="baseline"
          data-fs="xl"
          data-fw="bold"
          data-gap="2"
          data-lh="tight"
          data-stack="x"
        >
          {t("measurements.body_weight.value", {
            weight: WeightFormat.kilograms(latest.weight, BodyWeightDecimals),
          })}

          <span data-fs="xs">
            <DeltaKg current={latest.weight} decimals={BodyWeightDecimals} previous={previous?.weight} />
          </span>
        </div>

        <div data-color="neutral-500" data-fs="xs">
          {DateFormat.dayWithWeekday(language, Temporal.PlainDate.from(latest.measuredOn))}
        </div>
      </li>

      <li
        className="c-card"
        data-cross="center"
        data-gap="1"
        data-grow="1"
        data-md-width="100%"
        data-p="4"
        data-stack="y"
        {...Rhythm(TILE_MIN_WIDTH).times(1).style.minWidth}
      >
        <div
          data-color="neutral-500"
          data-cross="center"
          data-fs="xs"
          data-gap="1-5"
          data-ls="wide"
          data-stack="x"
          data-transform="uppercase"
        >
          <CalendarRange data-size="xs" />
          {t("measurements.body_weight.stats.week_average")}
        </div>

        <div
          data-color="neutral-0"
          data-cross="baseline"
          data-fs="xl"
          data-fw="bold"
          data-gap="2"
          data-lh="tight"
          data-stack="x"
        >
          {t("measurements.body_weight.value", {
            weight: WeightFormat.kilograms(average(window), BodyWeightDecimals),
          })}

          {previousWindow.length > 0 && (
            <span data-fs="xs">
              <DeltaKg
                current={average(window)}
                decimals={BodyWeightDecimals}
                previous={average(previousWindow)}
              />
            </span>
          )}
        </div>

        <div data-color="neutral-500" data-fs="xs">
          {t("measurements.body_weight.stats.week_average.count", { count: window.length })}
        </div>
      </li>

      <li
        className="c-card"
        data-cross="center"
        data-gap="1"
        data-grow="1"
        data-md-width="100%"
        data-p="4"
        data-stack="y"
        {...Rhythm(TILE_MIN_WIDTH).times(1).style.minWidth}
      >
        <div
          data-color="neutral-500"
          data-cross="center"
          data-fs="xs"
          data-gap="1-5"
          data-ls="wide"
          data-stack="x"
          data-transform="uppercase"
        >
          <TrendingUp data-size="xs" />
          {t(
            reference
              ? "measurements.body_weight.stats.since_reference"
              : "measurements.body_weight.stats.since_first",
          )}
        </div>

        <div data-color="neutral-0" data-fs="xl" data-fw="bold" data-lh="tight">
          {latest.weight === baseline.weight ? (
            t("measurements.body_weight.value", { weight: 0 })
          ) : (
            <DeltaKg current={latest.weight} decimals={BodyWeightDecimals} previous={baseline.weight} />
          )}
        </div>

        <div data-color="neutral-500" data-fs="xs">
          {DateFormat.dayWithWeekday(language, Temporal.PlainDate.from(baseline.measuredOn))}
        </div>
      </li>
    </ul>
  );
}
