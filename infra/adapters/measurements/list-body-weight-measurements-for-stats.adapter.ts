import { and, asc, desc, eq, gte, inArray, or, sql } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListBodyWeightMeasurementsForStatsQueryDrizzle
  implements Measurements.Queries.ListBodyWeightMeasurementsForStats
{
  async execute(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<Measurements.VO.BodyWeightMeasurement>> {
    const latestTwo = db
      .select({ id: Schema.bodyWeightMeasurements.id })
      .from(Schema.bodyWeightMeasurements)
      .where(eq(Schema.bodyWeightMeasurements.userId, userId))
      .orderBy(desc(Schema.bodyWeightMeasurements.measuredOn), desc(Schema.bodyWeightMeasurements.createdAt))
      .limit(2);

    const oldest = db
      .select({ id: Schema.bodyWeightMeasurements.id })
      .from(Schema.bodyWeightMeasurements)
      .where(eq(Schema.bodyWeightMeasurements.userId, userId))
      .orderBy(asc(Schema.bodyWeightMeasurements.measuredOn), asc(Schema.bodyWeightMeasurements.createdAt))
      .limit(1);

    const latestMeasuredOn = db
      .select({ measuredOn: Schema.bodyWeightMeasurements.measuredOn })
      .from(Schema.bodyWeightMeasurements)
      .where(eq(Schema.bodyWeightMeasurements.userId, userId))
      .orderBy(desc(Schema.bodyWeightMeasurements.measuredOn))
      .limit(1);

    return db
      .select()
      .from(Schema.bodyWeightMeasurements)
      .where(
        and(
          eq(Schema.bodyWeightMeasurements.userId, userId),
          or(
            inArray(Schema.bodyWeightMeasurements.id, latestTwo),
            inArray(Schema.bodyWeightMeasurements.id, oldest),
            eq(Schema.bodyWeightMeasurements.reference, true),
            gte(Schema.bodyWeightMeasurements.measuredOn, sql`date((${latestMeasuredOn}), '-13 days')`),
          ),
        ),
      )
      .orderBy(desc(Schema.bodyWeightMeasurements.measuredOn), desc(Schema.bodyWeightMeasurements.createdAt));
  }
}

export const ListBodyWeightMeasurementsForStatsQuery = new ListBodyWeightMeasurementsForStatsQueryDrizzle();
