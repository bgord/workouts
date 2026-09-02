import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Plans from "+plans";

type Dependencies = { GetPlanQuery: Plans.Queries.GetPlan };

export const PlanGet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();

    const userId = context.identity.authenticatedUserId();
    const planId = v.parse(Plans.VO.PlanId, params["planId"]);

    const plan = await deps.GetPlanQuery.execute(planId, userId);

    if (!plan) return new Response(null, { status: 404 });

    return Response.json(plan);
  };
