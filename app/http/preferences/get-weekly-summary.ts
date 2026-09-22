import type * as bg from "@bgord/bun";
import type * as Preferences from "+preferences";

type Dependencies = { GetWeeklySummaryQuery: Preferences.Queries.GetWeeklySummary };

export const GetWeeklySummary =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.authenticatedUserId();

    const weeklySummary = await deps.GetWeeklySummaryQuery.execute(userId);

    return Response.json({ weeklySummary });
  };
