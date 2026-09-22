import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as VO from "+notifications/value-objects";

export interface GetWeeklySummaryStatus {
  execute(
    userId: Auth.VO.UserIdType,
    weekIsoId: tools.WeekIsoIdType,
  ): Promise<VO.WeeklySummaryStatusEnum | null>;
}
