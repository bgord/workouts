import type * as bg from "@bgord/bun";
import type * as Auth from "+auth";
import type * as VO from "+plans/value-objects";

export type PlanListResponse = {
  data: { active: ReadonlyArray<VO.PlanSummary>; archived: ReadonlyArray<VO.PlanSummary> };
  actions: { create: bg.ActionState };
};

export interface ListPlans {
  execute(userId: Auth.VO.UserIdType): Promise<PlanListResponse>;
}
