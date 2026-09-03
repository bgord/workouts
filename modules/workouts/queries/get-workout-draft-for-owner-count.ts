import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";

export interface GetWorkoutDraftForOwnerCount {
  execute(userId: Auth.VO.UserIdType): Promise<tools.IntegerNonNegativeType>;
}
