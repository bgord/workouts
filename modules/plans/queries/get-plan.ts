import type * as Auth from "+auth";
import type * as VO from "+plans/value-objects";
import type { ActionState } from "./action-state";

export type PlanGetResponse = { data: VO.Plan; actions: { finalize: ActionState; rename: ActionState } };

export interface GetPlan {
  execute(planId: VO.PlanIdType, userId: Auth.VO.UserIdType): Promise<PlanGetResponse | null>;
}
