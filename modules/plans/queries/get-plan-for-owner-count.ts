import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";

export interface GetPlanForOwnerCount {
  execute(ownerId: Auth.VO.UserIdType): Promise<tools.IntegerNonNegativeType>;
}
