import { desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListBodyWeightMeasurementsQueryDrizzle implements Measurements.Queries.ListBodyWeightMeasurements {
  async execute(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<Measurements.VO.BodyWeightMeasurement>> {
    const entries = await db
      .select()
      .from(Schema.bodyWeightMeasurements)
      .where(eq(Schema.bodyWeightMeasurements.userId, userId))
      .orderBy(desc(Schema.bodyWeightMeasurements.measuredOn), desc(Schema.bodyWeightMeasurements.createdAt));

    return entries.map((entry) => ({
      id: entry.id,
      weight: entry.weight,
      measuredOn: entry.measuredOn,
      userId: entry.userId,
    }));
  }
}

export const ListBodyWeightMeasurementsQuery = new ListBodyWeightMeasurementsQueryDrizzle();
