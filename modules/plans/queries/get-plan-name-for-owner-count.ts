import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as VO from "+plans/value-objects";

export interface GetPlanNameForOwnerCount {
  execute(planName: VO.PlanNameType, userId: Auth.VO.UserIdType): Promise<tools.IntegerNonNegativeType>;
}
