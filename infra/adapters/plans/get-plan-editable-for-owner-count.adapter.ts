import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as Plans from "+plans";

class GetPlanEditableForOwnerCountQueryDrizzle implements Plans.Queries.GetPlanEditableForOwnerCount {
  async execute(_ownerId: Auth.VO.UserIdType): Promise<tools.IntegerNonNegativeType> {
    return tools.Int.nonNegative(0);
  }
}

export const GetPlanEditableForOwnerCountQuery = new GetPlanEditableForOwnerCountQueryDrizzle();
