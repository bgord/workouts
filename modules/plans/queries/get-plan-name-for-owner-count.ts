import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as Plans from "+plans";

export interface GetPlanNameForOwnerCount {
  execute(planName: Plans.VO.PlanNameType, userId: Auth.VO.UserIdType): Promise<tools.IntegerNonNegativeType>;
}
