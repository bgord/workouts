import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as VO from "+measurements/value-objects";

export interface ListDailyStepsForMonth {
  execute(userId: Auth.VO.UserIdType, month: tools.MonthIsoIdType): Promise<ReadonlyArray<VO.DailySteps>>;
}
