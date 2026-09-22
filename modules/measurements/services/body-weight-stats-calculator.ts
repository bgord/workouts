import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as VO from "+measurements/value-objects";
import { BodyWeightAverage } from "./body-weight-average";

const ROLLING_WINDOW_DAYS = 7;

export class BodyWeightStatsCalculator {
  constructor(private readonly measurements: ReadonlyArray<VO.BodyWeightMeasurement>) {}

  calculate(): VO.BodyWeightStats | null {
    const latest = this.measurements[0];
    const reference = this.measurements.find((measurement) => measurement.reference);
    const baseline = reference ?? this.measurements.at(-1);

    if (!(latest && baseline)) return null;

    const anchor = Temporal.PlainDate.from(latest.measuredOn);

    const week = new BodyWeightAverage(
      this.measurements,
      v.parse(tools.DayIsoId, anchor.subtract({ days: ROLLING_WINDOW_DAYS - 1 }).toString()),
      latest.measuredOn,
    ).calculate();

    const previousWeek = new BodyWeightAverage(
      this.measurements,
      v.parse(tools.DayIsoId, anchor.subtract({ days: ROLLING_WINDOW_DAYS * 2 - 1 }).toString()),
      v.parse(tools.DayIsoId, anchor.subtract({ days: ROLLING_WINDOW_DAYS }).toString()),
    ).calculate();

    return {
      latest,
      previous: this.measurements[1],
      reference,
      baseline,
      week: week ?? { average: latest.weight, count: 1 },
      previousWeek: previousWeek ? { average: previousWeek.average } : undefined,
    };
  }
}
