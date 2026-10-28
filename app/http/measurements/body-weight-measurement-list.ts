import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

export type BodyWeightListResponse = {
  month: Measurements.VO.BodyWeightHistoryMonthType | null;
  measurements: ReadonlyArray<Measurements.VO.BodyWeightMeasurement>;
  previous: Measurements.VO.BodyWeightMeasurement | null;
  months: ReadonlyArray<Measurements.VO.BodyWeightMonthSummary>;
  stats: Measurements.VO.BodyWeightStats | null;
  actions: { export: bg.ActionState };
};

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
    const actions = new Measurements.Services.BodyWeightListActions({
      measurements: measurementsForStats,
    }).calculate();

    const month = requested ?? months[0]?.month;

    if (!month) {
      const response: BodyWeightListResponse = {
        month: null,
        measurements: [],
        previous: null,
        months,
        stats,
        actions,
      };

      return Response.json(response);
    }

    if (month === Measurements.VO.BodyWeightHistoryMonthAll) {
      const measurements = await deps.ListBodyWeightMeasurementsQuery.execute(userId);

      const response: BodyWeightListResponse = {
        month,
        measurements,
        previous: null,
        months,
        stats,
        actions,
      };

      return Response.json(response);
    }

    const { measurements, previous } = await deps.ListBodyWeightMeasurementsForMonthQuery.execute(
      userId,
      month,
    );

    const response: BodyWeightListResponse = { month, measurements, previous, months, stats, actions };

    return Response.json(response);
  };
