import { desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListBodyPartMeasurementsQueryDrizzle implements Measurements.Queries.ListBodyPartMeasurements {
  async execute(userId: Auth.VO.UserIdType): Promise<Measurements.Queries.BodyPartMeasurementListResponse> {
    const measurements = await db
      .select({
        id: Schema.bodyPartMeasurements.id,
        bodyPartId: Schema.bodyPartMeasurements.bodyPartId,
        value: Schema.bodyPartMeasurements.value,
        measuredOn: Schema.bodyPartMeasurements.measuredOn,
        userId: Schema.bodyPartMeasurements.userId,
        archivedAt: Schema.bodyParts.archivedAt,
      })
      .from(Schema.bodyPartMeasurements)
      .innerJoin(Schema.bodyParts, eq(Schema.bodyParts.id, Schema.bodyPartMeasurements.bodyPartId))
      .where(eq(Schema.bodyPartMeasurements.userId, userId))
      .orderBy(desc(Schema.bodyPartMeasurements.measuredOn), desc(Schema.bodyPartMeasurements.createdAt));

    const data = measurements.map(({ archivedAt, ...measurement }) => ({
      ...measurement,
      actions: new Measurements.Services.BodyPartMeasurementListItemActions({
        bodyPart: { archivedAt },
      }).calculate(),
    }));

    return { data };
  }
}

export const ListBodyPartMeasurementsQuery = new ListBodyPartMeasurementsQueryDrizzle();
