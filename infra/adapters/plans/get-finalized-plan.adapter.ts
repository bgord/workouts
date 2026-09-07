import type * as Auth from "+auth";
import * as Plans from "+plans";
import { GetPlanQuery } from "./get-plan.adapter";

class GetFinalizedPlanQueryDrizzle implements Plans.Queries.GetFinalizedPlan {
  async execute(planId: Plans.VO.PlanIdType, userId: Auth.VO.UserIdType): Promise<Plans.VO.Plan | null> {
    const result = await GetPlanQuery.execute(planId, userId);

    if (result?.data.status !== Plans.VO.PlanStatusEnum.finalized) return null;

    return result.data;
  }
}

export const GetFinalizedPlanQuery = new GetFinalizedPlanQueryDrizzle();
