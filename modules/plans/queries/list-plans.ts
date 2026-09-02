import type * as Auth from "+auth";
import type * as VO from "+plans/value-objects";

export interface ListPlans {
  execute(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<VO.PlanSummary>>;
}
