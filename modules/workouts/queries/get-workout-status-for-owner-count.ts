import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as VO from "+workouts/value-objects";

export interface GetWorkoutStatusForOwnerCount {
  execute(userId: Auth.VO.UserIdType, status: VO.WorkoutStatusEnum): Promise<tools.IntegerNonNegativeType>;
}
