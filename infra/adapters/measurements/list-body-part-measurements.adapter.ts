import { and, desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListBodyPartMeasurementsQueryDrizzle implements Measurements.Queries.ListBodyPartMeasurements {
  async execute(
    userId: Auth.VO.UserIdType,
    bodyPartId: Measurements.VO.BodyPartIdType,
  ): Promise<Measurements.Queries.BodyPartMeasurementListResponse> {
    const measurements = await db
      .select({
        id: Schema.bodyPartMeasurements.id,
        bodyPartId: Schema.bodyPartMeasurements.bodyPartId,
        value: Schema.bodyPartMeasurements.value,
        measuredOn: Schema.bodyPartMeasurements.measuredOn,
        userId: Schema.bodyPartMeasurements.userId,
      })
      .from(Schema.bodyPartMeasurements)
      .where(
        and(
          eq(Schema.bodyPartMeasurements.userId, userId),
          eq(Schema.bodyPartMeasurements.bodyPartId, bodyPartId),
        ),
      )
      .orderBy(desc(Schema.bodyPartMeasurements.measuredOn), desc(Schema.bodyPartMeasurements.createdAt));

    return { data: new Measurements.Services.BodyPartMeasurementDeltas(measurements).calculate() };
  }
}

export const ListBodyPartMeasurementsQuery = new ListBodyPartMeasurementsQueryDrizzle();
