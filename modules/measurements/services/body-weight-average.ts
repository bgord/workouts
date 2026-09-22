import * as tools from "@bgord/tools";
import type * as VO from "+measurements/value-objects";

export class BodyWeightAverage {
  static forWeek(measurements: ReadonlyArray<VO.BodyWeightMeasurement>, week: tools.Week) {
    return new BodyWeightAverage(
      measurements,
      tools.Day.fromTimestamp(week.getStart()).toIsoId(),
      tools.Day.fromTimestamp(week.getEnd()).toIsoId(),
    );
  }

  constructor(
    private readonly measurements: ReadonlyArray<VO.BodyWeightMeasurement>,
    private readonly from: tools.DayIsoIdType,
    private readonly to: tools.DayIsoIdType,
  ) {}

  calculate(): { average: number; count: number } | null {
    const within = this.measurements.filter(
      (measurement) => measurement.measuredOn >= this.from && measurement.measuredOn <= this.to,
    );

    if (within.length === 0) return null;

    const total = within.reduce((sum, measurement) => sum + measurement.weight, 0);

    return { average: Math.round(total / within.length), count: within.length };
  }
}
