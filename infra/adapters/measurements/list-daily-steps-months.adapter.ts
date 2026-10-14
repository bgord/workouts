import * as tools from "@bgord/tools";
import { count, desc, eq, sql } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListDailyStepsMonthsQueryDrizzle implements Measurements.Queries.ListDailyStepsMonths {
  async execute(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<Measurements.VO.DailyStepsMonthSummary>> {
    const month = sql<tools.MonthIsoIdType>`substr(${Schema.dailySteps.day}, 1, 7)`;

    return db
      .select({ month, count: count().mapWith(tools.Int.nonNegative) })
      .from(Schema.dailySteps)
      .where(eq(Schema.dailySteps.userId, userId))
      .groupBy(month)
      .orderBy(desc(month));
  }
}

export const ListDailyStepsMonthsQuery = new ListDailyStepsMonthsQueryDrizzle();
