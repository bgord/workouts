import type * as Auth from "+auth";
import type * as VO from "+plans/value-objects";

export type PlanHistoryGetResponse = { data: VO.PlanHistoryPage };

export interface GetPlanHistory {
  execute(
    planId: VO.PlanIdType,
    userId: Auth.VO.UserIdType,
    config: VO.PlanHistoryPageConfig,
  ): Promise<PlanHistoryGetResponse | null>;
}
