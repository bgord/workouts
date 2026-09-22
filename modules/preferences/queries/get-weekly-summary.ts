import type * as Auth from "+auth";
import type * as VO from "+preferences/value-objects";

export interface GetWeeklySummary {
  execute(userId: Auth.VO.UserIdType): Promise<VO.WeeklySummaryType>;
}
