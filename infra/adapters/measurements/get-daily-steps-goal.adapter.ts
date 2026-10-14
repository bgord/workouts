import { eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetDailyStepsGoalQueryDrizzle implements Measurements.Queries.GetDailyStepsGoal {
  async execute(userId: Auth.VO.UserIdType): Promise<Measurements.VO.StepsCountType | null> {
    const row = await db
      .select({ goal: Schema.dailyStepsGoals.goal })
      .from(Schema.dailyStepsGoals)
      .where(eq(Schema.dailyStepsGoals.userId, userId))
      .get();

    return row?.goal ?? null;
  }
}

export const GetDailyStepsGoalQuery = new GetDailyStepsGoalQueryDrizzle();
