import type * as bg from "@bgord/bun";
import type * as Plans from "+plans";

type Dependencies = { ListPlansQuery: Plans.Queries.ListPlans };

export const PlanList =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.authenticatedUserId();

    const plans = await deps.ListPlansQuery.execute(userId);

    return Response.json(plans);
  };
