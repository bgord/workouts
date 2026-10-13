import type * as tools from "@bgord/tools";
import { and, desc, eq, like } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListDailyStepsForMonthQueryDrizzle implements Measurements.Queries.ListDailyStepsForMonth {
  async execute(
    userId: Auth.VO.UserIdType,
    month: tools.MonthIsoIdType,
  ): Promise<ReadonlyArray<Measurements.VO.DailySteps>> {
    return db
      .select({
        userId: Schema.dailySteps.userId,
        day: Schema.dailySteps.day,
        count: Schema.dailySteps.count,
        source: Schema.dailySteps.source,
      })
      .from(Schema.dailySteps)
      .where(and(eq(Schema.dailySteps.userId, userId), like(Schema.dailySteps.day, `${month}-%`)))
      .orderBy(desc(Schema.dailySteps.day));
  }
}

export const ListDailyStepsForMonthQuery = new ListDailyStepsForMonthQueryDrizzle();
