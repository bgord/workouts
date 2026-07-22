import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as Plans from "+plans";

class GetPlanNameForOwnerCountQueryDrizzle implements Plans.Queries.GetPlanNameForOwnerCount {
  async execute(
    _planName: Plans.VO.PlanNameType,
    _ownerId: Auth.VO.UserIdType,
  ): Promise<tools.IntegerNonNegativeType> {
    return tools.Int.nonNegative(0);
  }
}

export const GetPlanNameForOwnerCountQuery = new GetPlanNameForOwnerCountQueryDrizzle();
