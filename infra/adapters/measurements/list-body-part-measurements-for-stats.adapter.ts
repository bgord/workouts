import { and, asc, desc, eq, gte, inArray, or, sql } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListBodyPartMeasurementsForStatsQueryDrizzle
  implements Measurements.Queries.ListBodyPartMeasurementsForStats
{
  async execute(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<Measurements.VO.BodyPartMeasurement>> {
    const latestTwo = db
      .select({ id: Schema.bodyPartMeasurements.id })
      .from(Schema.bodyPartMeasurements)
      .where(eq(Schema.bodyPartMeasurements.userId, userId))
      .orderBy(desc(Schema.bodyPartMeasurements.measuredOn), desc(Schema.bodyPartMeasurements.createdAt))
      .limit(2);

    const oldest = db
      .select({ id: Schema.bodyPartMeasurements.id })
      .from(Schema.bodyPartMeasurements)
      .where(eq(Schema.bodyPartMeasurements.userId, userId))
      .orderBy(asc(Schema.bodyPartMeasurements.measuredOn), asc(Schema.bodyPartMeasurements.createdAt))
      .limit(1);

    const latestMeasuredOn = db
      .select({ measuredOn: Schema.bodyPartMeasurements.measuredOn })
      .from(Schema.bodyPartMeasurements)
      .where(eq(Schema.bodyPartMeasurements.userId, userId))
      .orderBy(desc(Schema.bodyPartMeasurements.measuredOn))
      .limit(1);

    return db
      .select()
      .from(Schema.bodyPartMeasurements)
      .where(
        and(
          eq(Schema.bodyPartMeasurements.userId, userId),
          or(
            inArray(Schema.bodyPartMeasurements.id, latestTwo),
            inArray(Schema.bodyPartMeasurements.id, oldest),
            gte(Schema.bodyPartMeasurements.measuredOn, sql`date((${latestMeasuredOn}), '-13 days')`),
          ),
        ),
      )
      .orderBy(desc(Schema.bodyPartMeasurements.measuredOn), desc(Schema.bodyPartMeasurements.createdAt));
  }
}

export const ListBodyPartMeasurementsForStatsQuery = new ListBodyPartMeasurementsForStatsQueryDrizzle();
