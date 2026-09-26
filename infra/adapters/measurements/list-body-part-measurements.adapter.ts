import { and, desc, eq } from "drizzle-orm";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListBodyPartMeasurementsQueryDrizzle implements Measurements.Queries.ListBodyPartMeasurements {
  async execute(
    userId: Measurements.VO.BodyPart["userId"],
    bodyPartId: Measurements.VO.BodyPartIdType,
  ): Promise<ReadonlyArray<Measurements.VO.BodyPartMeasurement>> {
    return db
      .select()
      .from(Schema.bodyPartMeasurements)
      .where(
        and(
          eq(Schema.bodyPartMeasurements.userId, userId),
          eq(Schema.bodyPartMeasurements.bodyPartId, bodyPartId),
        ),
      )
      .orderBy(desc(Schema.bodyPartMeasurements.measuredOn));
  }
}

export const ListBodyPartMeasurementsQuery = new ListBodyPartMeasurementsQueryDrizzle();
