import type * as Auth from "+auth";
import type * as VO from "+measurements/value-objects";

export interface GetDailySteps {
  execute(userId: Auth.VO.UserIdType, day: VO.StepsDayType): Promise<VO.DailySteps | null>;
}
