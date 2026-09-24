import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  ListBodyWeightMeasurementsQuery: Measurements.Queries.ListBodyWeightMeasurements;
  ListBodyWeightMeasurementsForMonthQuery: Measurements.Queries.ListBodyWeightMeasurementsForMonth;
  ListBodyWeightMeasurementsForStatsQuery: Measurements.Queries.ListBodyWeightMeasurementsForStats;
  ListBodyWeightMonthsQuery: Measurements.Queries.ListBodyWeightMonths;
};

export const BodyWeightMeasurementList =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const requested = v.parse(v.optional(Measurements.VO.BodyWeightHistoryMonth), body["month"]);

    const [months, measurementsForStats] = await Promise.all([
      deps.ListBodyWeightMonthsQuery.execute(userId),
      deps.ListBodyWeightMeasurementsForStatsQuery.execute(userId),
    ]);
    const stats = new Measurements.Services.BodyWeightStatsCalculator(measurementsForStats).calculate();

    const month = requested ?? months[0]?.month;

    if (!month) return Response.json({ month: null, measurements: [], previous: null, months, stats });

    if (month === Measurements.VO.BodyWeightHistoryMonthAll) {
      const measurements = await deps.ListBodyWeightMeasurementsQuery.execute(userId);

      return Response.json({ month, measurements, previous: null, months, stats });
    }

    const { measurements, previous } = await deps.ListBodyWeightMeasurementsForMonthQuery.execute(
      userId,
      month,
    );

    return Response.json({ month, measurements, previous, months, stats });
  };
