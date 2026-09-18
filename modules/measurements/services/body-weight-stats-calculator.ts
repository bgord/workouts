import type * as VO from "+measurements/value-objects";

const ROLLING_WINDOW_DAYS = 7;

const average = (measurements: ReadonlyArray<VO.BodyWeightMeasurement>) =>
  measurements.reduce((sum, measurement) => sum + measurement.weight, 0) / measurements.length;

export class BodyWeightStatsCalculator {
  constructor(private readonly measurements: ReadonlyArray<VO.BodyWeightMeasurement>) {}

  calculate(): VO.BodyWeightStats | null {
    const latest = this.measurements[0];
    const reference = this.measurements.find((measurement) => measurement.reference);
    const baseline = reference ?? this.measurements.at(-1);

    if (!(latest && baseline)) return null;

    const anchor = Temporal.PlainDate.from(latest.measuredOn);
    const windowStart = anchor.subtract({ days: ROLLING_WINDOW_DAYS - 1 }).toString();
    const previousWindowStart = anchor.subtract({ days: ROLLING_WINDOW_DAYS * 2 - 1 }).toString();

    const window = this.measurements.filter((measurement) => measurement.measuredOn >= windowStart);
    const previousWindow = this.measurements.filter(
      (measurement) => measurement.measuredOn >= previousWindowStart && measurement.measuredOn < windowStart,
    );

    return {
      latest,
      previous: this.measurements[1],
      reference,
      baseline,
      week: { average: average(window), count: window.length },
      previousWeek: previousWindow.length > 0 ? { average: average(previousWindow) } : undefined,
    };
  }
}
