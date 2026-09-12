import { Rhythm, useLanguage, useTranslations } from "@bgord/ui";
import { Scale, TrendingUp } from "lucide-react";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import { DeltaKg } from "../components/delta-kg";
import { DateFormat } from "../services/date-format";
import { BodyWeightDecimals, WeightFormat } from "../services/weight-format";

const TILE_MIN_WIDTH = 168;

export function BodyWeightStats(props: { measurements: ReadonlyArray<BodyWeightMeasurement> }) {
  const t = useTranslations();
  const language = useLanguage();

  const latest = props.measurements[0];
  const previous = props.measurements[1];
  const first = props.measurements.at(-1);

  if (!(latest && first)) return null;

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
          <TrendingUp data-size="xs" />
          {t("measurements.body_weight.stats.since_first")}
        </div>

        <div data-color="neutral-0" data-fs="xl" data-fw="bold" data-lh="tight">
          {latest.weight === first.weight ? (
            t("measurements.body_weight.value", { weight: 0 })
          ) : (
            <DeltaKg current={latest.weight} decimals={BodyWeightDecimals} previous={first.weight} />
          )}
        </div>

        <div data-color="neutral-500" data-fs="xs">
          {DateFormat.dayWithWeekday(language, Temporal.PlainDate.from(first.measuredOn))}
        </div>
      </li>
    </ul>
  );
}
