import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  ListDailyStepsQuery: Measurements.Queries.ListDailySteps;
  ListDailyStepsForMonthQuery: Measurements.Queries.ListDailyStepsForMonth;
  ListDailyStepsMonthsQuery: Measurements.Queries.ListDailyStepsMonths;
};

export const DailyStepsList =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const requested = v.parse(v.optional(Measurements.VO.DailyStepsHistoryMonth), body["month"]);

    const [months, all] = await Promise.all([
      deps.ListDailyStepsMonthsQuery.execute(userId),
      deps.ListDailyStepsQuery.execute(userId),
    ]);
    const stats = new Measurements.Services.DailyStepsStatsCalculator(all).calculate();

    const month = requested ?? months[0]?.month;

    if (!month) return Response.json({ month: null, entries: [], previous: null, months, stats });

    if (month === Measurements.VO.DailyStepsHistoryMonthAll) {
      return Response.json({ month, entries: all, previous: null, months, stats });
    }

    const { entries, previous } = await deps.ListDailyStepsForMonthQuery.execute(userId, month);

    return Response.json({ month, entries, previous, months, stats });
  };
