import type * as bg from "@bgord/bun";
import * as Measurements from "+measurements";

type Dependencies = { ListDailyStepsQuery: Measurements.Queries.ListDailySteps };

export const DailyStepsList =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.authenticatedUserId();

    const entries = await deps.ListDailyStepsQuery.execute(userId);
    const stats = new Measurements.Services.DailyStepsStatsCalculator(entries).calculate();

    return Response.json({ entries, stats });
  };
