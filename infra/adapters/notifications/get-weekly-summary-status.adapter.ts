import type * as tools from "@bgord/tools";
import { and, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Notifications from "+notifications";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetWeeklySummaryStatusQueryDrizzle implements Notifications.Queries.GetWeeklySummaryStatus {
  async execute(
    userId: Auth.VO.UserIdType,
    weekIsoId: tools.WeekIsoIdType,
  ): Promise<Notifications.VO.WeeklySummaryStatusEnum | null> {
    const row = await db
      .select({ status: Schema.weeklySummaries.status })
      .from(Schema.weeklySummaries)
      .where(and(eq(Schema.weeklySummaries.userId, userId), eq(Schema.weeklySummaries.weekIsoId, weekIsoId)))
      .get();

    return row?.status ?? null;
  }
}

export const GetWeeklySummaryStatusQuery = new GetWeeklySummaryStatusQueryDrizzle();
