import type * as Auth from "+auth";
import type * as Queries from "+measurements/queries";
import type * as VO from "+measurements/value-objects";

type Config = { ListBodyWeightMeasurements: Queries.ListBodyWeightMeasurements };

const average = (measurements: ReadonlyArray<VO.BodyWeightMeasurement>) =>
  measurements.reduce((sum, measurement) => sum + measurement.weight, 0) / measurements.length;

export class BodyWeightStatsCalculator {
  constructor(private readonly config: Config) {}

  private static readonly ROLLING_WINDOW_DAYS = 7;

  async calculate(userId: Auth.VO.UserIdType): Promise<VO.BodyWeightStats | null> {
    const measurements = await this.config.ListBodyWeightMeasurements.execute(userId);

    const latest = measurements[0];
    const reference = measurements.find((measurement) => measurement.reference);
    const baseline = reference ?? measurements.at(-1);

    if (!(latest && baseline)) return null;

    const anchor = Temporal.PlainDate.from(latest.measuredOn);

    const windowStart = anchor
      .subtract({ days: BodyWeightStatsCalculator.ROLLING_WINDOW_DAYS - 1 })
      .toString();

    const previousWindowStart = anchor
      .subtract({ days: BodyWeightStatsCalculator.ROLLING_WINDOW_DAYS * 2 - 1 })
      .toString();

    const window = measurements.filter((measurement) => measurement.measuredOn >= windowStart);
    const previousWindow = measurements.filter(
      (measurement) => measurement.measuredOn >= previousWindowStart && measurement.measuredOn < windowStart,
    );

    return {
      latest,
      previous: measurements[1],
      reference,
      baseline,
      week: { average: average(window), count: window.length },
      previousWeek: previousWindow.length > 0 ? { average: average(previousWindow) } : undefined,
    };
  }
}
