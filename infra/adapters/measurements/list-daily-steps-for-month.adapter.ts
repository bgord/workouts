import type * as tools from "@bgord/tools";
import { and, desc, eq, like, lt } from "drizzle-orm";
import * as v from "valibot";
import type * as Auth from "+auth";
import * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

const columns = {
  userId: Schema.dailySteps.userId,
  day: Schema.dailySteps.day,
  count: Schema.dailySteps.count,
  source: Schema.dailySteps.source,
};

class ListDailyStepsForMonthQueryDrizzle implements Measurements.Queries.ListDailyStepsForMonth {
  async execute(
    userId: Auth.VO.UserIdType,
    month: tools.MonthIsoIdType,
  ): Promise<{
    entries: ReadonlyArray<Measurements.VO.DailySteps>;
    previous: Measurements.VO.DailySteps | null;
  }> {
    const [entries, [previous]] = await Promise.all([
      db
        .select(columns)
        .from(Schema.dailySteps)
        .where(and(eq(Schema.dailySteps.userId, userId), like(Schema.dailySteps.day, `${month}-%`)))
        .orderBy(desc(Schema.dailySteps.day)),
      db
        .select(columns)
        .from(Schema.dailySteps)
        .where(
          and(
            eq(Schema.dailySteps.userId, userId),
            lt(Schema.dailySteps.day, v.parse(Measurements.VO.StepsDay, `${month}-01`)),
          ),
        )
        .orderBy(desc(Schema.dailySteps.day))
        .limit(1),
    ]);

    return { entries, previous: previous ?? null };
  }
}

export const ListDailyStepsForMonthQuery = new ListDailyStepsForMonthQueryDrizzle();
