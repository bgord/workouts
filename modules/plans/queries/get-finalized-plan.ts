import type * as Auth from "+auth";
import type * as VO from "+plans/value-objects";

export interface GetFinalizedPlan {
  execute(planId: VO.PlanIdType, userId: Auth.VO.UserIdType): Promise<VO.Plan | null>;
}
