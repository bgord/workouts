import { desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListBodyPartMeasurementsQueryDrizzle implements Measurements.Queries.ListBodyPartMeasurements {
  async execute(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<Measurements.VO.BodyPartMeasurement>> {
    return db
      .select()
      .from(Schema.bodyPartMeasurements)
      .where(eq(Schema.bodyPartMeasurements.userId, userId))
      .orderBy(desc(Schema.bodyPartMeasurements.measuredOn), desc(Schema.bodyPartMeasurements.createdAt));
  }
}

export const ListBodyPartMeasurementsQuery = new ListBodyPartMeasurementsQueryDrizzle();
