import type * as tools from "@bgord/tools";
import { count, desc, eq, sql } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListBodyPartMonthsQueryDrizzle implements Measurements.Queries.ListBodyPartMonths {
  async execute(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<Measurements.VO.BodyPartMonthSummary>> {
    const month = sql<tools.MonthIsoIdType>`substr(${Schema.bodyPartMeasurements.measuredOn}, 1, 7)`;

    return db
      .select({ month, count: count() })
      .from(Schema.bodyPartMeasurements)
      .where(eq(Schema.bodyPartMeasurements.userId, userId))
      .groupBy(month)
      .orderBy(desc(month));
  }
}

export const ListBodyPartMonthsQuery = new ListBodyPartMonthsQueryDrizzle();
