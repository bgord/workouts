import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as VO from "+measurements/value-objects";
import { BodyWeightAverage } from "./body-weight-average";

export class BodyWeightChart {
  constructor(private readonly measurements: ReadonlyArray<VO.BodyWeightMeasurement>) {}

  points(granularity: VO.BodyWeightChartGranularityType): ReadonlyArray<VO.BodyWeightChartPoint> {
    const chronological = this.measurements.toReversed();

    if (granularity === VO.BodyWeightChartGranularityOptions.daily) {
      return chronological.map((measurement) => ({
        from: measurement.measuredOn,
        to: measurement.measuredOn,
        weight: measurement.weight,
        count: 1,
        reference: measurement.reference,
      }));
    }

    const weeks = Map.groupBy(chronological, (measurement) =>
      tools.Week.fromTimestamp(tools.Day.fromIsoId(measurement.measuredOn).getStart()).toIsoId(),
    );

    return [...weeks.values()].map((week) => {
      const from = week[0]!.measuredOn;
      const to = week.at(-1)!.measuredOn;
      const { average, count } = new BodyWeightAverage(week, from, to).calculate()!;

      return {
        from,
        to,
        weight: v.parse(VO.BodyWeight, average),
        count,
        reference: week.some((measurement) => measurement.reference),
      };
    });
  }
}
