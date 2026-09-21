import { desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListBodyWeightMeasurementsQueryDrizzle implements Measurements.Queries.ListBodyWeightMeasurements {
  async execute(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<Measurements.VO.BodyWeightMeasurement>> {
    return db
      .select()
      .from(Schema.bodyWeightMeasurements)
      .where(eq(Schema.bodyWeightMeasurements.userId, userId))
      .orderBy(desc(Schema.bodyWeightMeasurements.measuredOn), desc(Schema.bodyWeightMeasurements.createdAt));
  }
}

export const ListBodyWeightMeasurementsQuery = new ListBodyWeightMeasurementsQueryDrizzle();
