import { and, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetDailyStepsQueryDrizzle implements Measurements.Queries.GetDailySteps {
  async execute(
    userId: Auth.VO.UserIdType,
    day: Measurements.VO.DailyStepsDayType,
  ): Promise<Measurements.VO.DailySteps | null> {
    const dailySteps = await db
      .select()
      .from(Schema.dailySteps)
      .where(and(eq(Schema.dailySteps.userId, userId), eq(Schema.dailySteps.day, day)))
      .get();

    return dailySteps ?? null;
  }
}

export const GetDailyStepsQuery = new GetDailyStepsQueryDrizzle();
