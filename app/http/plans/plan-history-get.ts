import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Plans from "+plans";

type Dependencies = { GetPlanHistoryQuery: Plans.Queries.GetPlanHistory };

export const PlanHistoryGet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const planId = v.parse(Plans.VO.PlanId, params["planId"]);
    const cursor = v.parse(v.optional(tools.IntegerNonNegative), body["cursor"]);

    const history = await deps.GetPlanHistoryQuery.execute(planId, userId, {
      cursor,
      limit: Plans.VO.PlanHistoryPageLimit,
    });

    if (!history) return new Response(null, { status: 404 });

    return Response.json(history);
  };
