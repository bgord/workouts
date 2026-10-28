import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

export type DailyStepsListResponse = {
  month: Measurements.VO.DailyStepsHistoryMonthType | null;
  entries: ReadonlyArray<Measurements.VO.DailyStepsEntry>;
  previous: Measurements.VO.DailySteps | null;
  months: ReadonlyArray<Measurements.VO.DailyStepsMonthSummary>;
  stats: Measurements.VO.DailyStepsStats | null;
  goal: Measurements.VO.DailyStepsGoalType | null;
  actions: { export: bg.ActionState };
};

type Dependencies = {
  ListDailyStepsQuery: Measurements.Queries.ListDailySteps;
  ListDailyStepsForMonthQuery: Measurements.Queries.ListDailyStepsForMonth;
  ListDailyStepsMonthsQuery: Measurements.Queries.ListDailyStepsMonths;
  GetDailyStepsGoalQuery: Measurements.Queries.GetDailyStepsGoal;
};

export const DailyStepsList =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const requested = v.parse(v.optional(Measurements.VO.DailyStepsHistoryMonth), body["month"]);

    const [months, all, goal] = await Promise.all([
      deps.ListDailyStepsMonthsQuery.execute(userId),
      deps.ListDailyStepsQuery.execute(userId),
      deps.GetDailyStepsGoalQuery.execute(userId),
    ]);
    const stats = new Measurements.Services.DailyStepsStatsCalculator(all).calculate();
    const actions = new Measurements.Services.DailyStepsListActions({ entries: all }).calculate();

    const month = requested ?? months[0]?.month;

    const entry = (dailySteps: Measurements.VO.DailySteps): Measurements.VO.DailyStepsEntry => ({
      ...dailySteps,
      belowGoal: new Measurements.Services.DailyStepsBelowGoal({ goal, count: dailySteps.count }).calculate(),
    });

    if (!month) {
      const response: DailyStepsListResponse = {
        month: null,
        entries: [],
        previous: null,
        months,
        stats,
        goal,
        actions,
      };

      return Response.json(response);
    }

    if (month === Measurements.VO.DailyStepsHistoryMonthAll) {
      const response: DailyStepsListResponse = {
        month,
        entries: all.map(entry),
        previous: null,
        months,
        stats,
        goal,
        actions,
      };

      return Response.json(response);
    }

    const { entries, previous } = await deps.ListDailyStepsForMonthQuery.execute(userId, month);

    const response: DailyStepsListResponse = {
      month,
      entries: entries.map(entry),
      previous,
      months,
      stats,
      goal,
      actions,
    };

    return Response.json(response);
  };
