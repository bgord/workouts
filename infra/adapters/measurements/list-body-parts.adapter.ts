import { asc, desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListBodyPartsQueryDrizzle implements Measurements.Queries.ListBodyParts {
  async execute(userId: Auth.VO.UserIdType): Promise<Measurements.Queries.BodyPartListResponse> {
    const [bodyParts, measurements] = await Promise.all([
      db
        .select({ id: Schema.bodyParts.id, name: Schema.bodyParts.name, userId: Schema.bodyParts.userId })
        .from(Schema.bodyParts)
        .where(eq(Schema.bodyParts.userId, userId))
        .orderBy(asc(Schema.bodyParts.name)),
      db
        .select({
          id: Schema.bodyPartMeasurements.id,
          bodyPartId: Schema.bodyPartMeasurements.bodyPartId,
          value: Schema.bodyPartMeasurements.value,
          measuredOn: Schema.bodyPartMeasurements.measuredOn,
        })
        .from(Schema.bodyPartMeasurements)
        .where(eq(Schema.bodyPartMeasurements.userId, userId))
        .orderBy(desc(Schema.bodyPartMeasurements.measuredOn), desc(Schema.bodyPartMeasurements.createdAt)),
    ]);

    const grouped = Object.groupBy(measurements, (measurement) => measurement.bodyPartId);

    const data = bodyParts.map((bodyPart) => ({
      ...bodyPart,
      measurements: grouped[bodyPart.id] ?? [],
    }));

    return {
      data,
      actions: new Measurements.Services.BodyPartListActions({ bodyParts }).calculate(),
    };
  }
}

export const ListBodyPartsQuery = new ListBodyPartsQueryDrizzle();
