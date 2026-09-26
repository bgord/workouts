import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as VO from "+measurements/value-objects";
import { BodyPartAverage } from "./body-part-average";

export class BodyPartChart {
  constructor(private readonly measurements: ReadonlyArray<VO.BodyPartMeasurement>) {}

  points(granularity: VO.BodyPartChartGranularityType): ReadonlyArray<VO.BodyPartChartPoint> {
    const chronological = this.measurements.toReversed();

    if (granularity === VO.BodyPartChartGranularityOptions.daily) {
      return chronological.map((measurement) => ({
        from: measurement.measuredOn,
        to: measurement.measuredOn,
        value: measurement.value,
        count: 1,
      }));
    }

    const weeks = Map.groupBy(chronological, (measurement) =>
      tools.Week.fromTimestamp(tools.Day.fromIsoId(measurement.measuredOn).getStart()).toIsoId(),
    );

    return [...weeks.values()].map((week) => {
      const from = week[0]!.measuredOn;
      const to = week.at(-1)!.measuredOn;
      const { average, count } = new BodyPartAverage(week, from, to).calculate()!;

      return { from, to, value: v.parse(VO.BodyPartMeasurementValue, average), count };
    });
  }
}
