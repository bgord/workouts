import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  ListBodyPartsQuery: Measurements.Queries.ListBodyParts;
  ListBodyPartMeasurementsQuery: Measurements.Queries.ListBodyPartMeasurements;
  ListBodyPartMeasurementsForMonthQuery: Measurements.Queries.ListBodyPartMeasurementsForMonth;
  ListBodyPartMeasurementsForStatsQuery: Measurements.Queries.ListBodyPartMeasurementsForStats;
  ListBodyPartMonthsQuery: Measurements.Queries.ListBodyPartMonths;
};

export const BodyPartMeasurementList =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const requested = v.parse(v.optional(Measurements.VO.BodyPartHistoryMonth), body["month"]);

    const [bodyParts, months, measurementsForStats] = await Promise.all([
      deps.ListBodyPartsQuery.execute(userId),
      deps.ListBodyPartMonthsQuery.execute(userId),
      deps.ListBodyPartMeasurementsForStatsQuery.execute(userId),
    ]);
    const stats = new Measurements.Services.BodyPartStatsCalculator(measurementsForStats).calculate();

    const month = requested ?? months[0]?.month;

    if (!month) {
      return Response.json({ month: null, measurements: [], previous: null, months, stats, bodyParts });
    }

    if (month === Measurements.VO.BodyPartHistoryMonthAll) {
      const measurements = await deps.ListBodyPartMeasurementsQuery.execute(userId);

      return Response.json({ month, measurements, previous: null, months, stats, bodyParts });
    }

    const { measurements, previous } = await deps.ListBodyPartMeasurementsForMonthQuery.execute(
      userId,
      month,
    );

    return Response.json({ month, measurements, previous, months, stats, bodyParts });
  };
