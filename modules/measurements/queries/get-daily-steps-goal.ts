import type * as Auth from "+auth";
import type * as VO from "+measurements/value-objects";

export interface GetDailyStepsGoal {
  execute(userId: Auth.VO.UserIdType): Promise<VO.StepsCountType | null>;
}
