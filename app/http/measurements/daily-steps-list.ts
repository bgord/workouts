import type * as bg from "@bgord/bun";
import type * as Measurements from "+measurements";

type Dependencies = { ListDailyStepsQuery: Measurements.Queries.ListDailySteps };

export const DailyStepsList =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.authenticatedUserId();

    const dailySteps = await deps.ListDailyStepsQuery.execute(userId);

    return Response.json(dailySteps);
  };
