import { and, eq } from "drizzle-orm";
import * as v from "valibot";
import type * as Auth from "+auth";
import * as Preferences from "+preferences";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetWeeklySummaryQueryDrizzle implements Preferences.Queries.GetWeeklySummary {
  async execute(userId: Auth.VO.UserIdType): Promise<Preferences.VO.WeeklySummaryType> {
    const row = await db.query.userPreferences.findFirst({
      where: and(
        eq(Schema.userPreferences.userId, userId),
        eq(Schema.userPreferences.preference, "weekly_summary"),
      ),
      columns: { value: true },
    });

    if (!row) return Preferences.VO.WeeklySummaryDefault;
    return v.parse(Preferences.VO.WeeklySummary, row.value);
  }
}

export const GetWeeklySummaryQuery = new GetWeeklySummaryQueryDrizzle();
