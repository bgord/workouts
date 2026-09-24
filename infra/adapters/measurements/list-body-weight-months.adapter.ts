import type * as tools from "@bgord/tools";
import { count, desc, eq, sql } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListBodyWeightMonthsQueryDrizzle implements Measurements.Queries.ListBodyWeightMonths {
  async execute(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<Measurements.VO.BodyWeightMonthSummary>> {
    const month = sql<tools.MonthIsoIdType>`substr(${Schema.bodyWeightMeasurements.measuredOn}, 1, 7)`;

    return db
      .select({ month, count: count() })
      .from(Schema.bodyWeightMeasurements)
      .where(eq(Schema.bodyWeightMeasurements.userId, userId))
      .groupBy(month)
      .orderBy(desc(month));
  }
}

export const ListBodyWeightMonthsQuery = new ListBodyWeightMonthsQueryDrizzle();
