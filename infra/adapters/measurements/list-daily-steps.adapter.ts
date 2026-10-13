import { desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListDailyStepsQueryDrizzle implements Measurements.Queries.ListDailySteps {
  async execute(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<Measurements.VO.DailySteps>> {
    return db
      .select({
        userId: Schema.dailySteps.userId,
        day: Schema.dailySteps.day,
        count: Schema.dailySteps.count,
        source: Schema.dailySteps.source,
      })
      .from(Schema.dailySteps)
      .where(eq(Schema.dailySteps.userId, userId))
      .orderBy(desc(Schema.dailySteps.day));
  }
}

export const ListDailyStepsQuery = new ListDailyStepsQueryDrizzle();
