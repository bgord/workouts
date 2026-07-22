import type * as tools from "@bgord/tools";
import type * as Plans from "+plans";
import type * as Auth from "+auth";

export interface GetPlanNameForUserCount {
  execute(
    planName: Plans.VO.PlanNameType,
    ownerId: Auth.VO.UserIdType,
  ): Promise<tools.IntegerNonNegativeType>;
}
