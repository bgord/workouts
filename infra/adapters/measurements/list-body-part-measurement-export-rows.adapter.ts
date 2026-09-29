import { asc, desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListBodyPartMeasurementExportRowsQueryDrizzle
  implements Measurements.Queries.ListBodyPartMeasurementExportRows
{
  async execute(
    userId: Auth.VO.UserIdType,
  ): Promise<ReadonlyArray<Measurements.Queries.BodyPartMeasurementExportRow>> {
    return db
      .select({
        id: Schema.bodyPartMeasurements.id,
        bodyPartName: Schema.bodyParts.name,
        value: Schema.bodyPartMeasurements.value,
        measuredOn: Schema.bodyPartMeasurements.measuredOn,
      })
      .from(Schema.bodyPartMeasurements)
      .innerJoin(Schema.bodyParts, eq(Schema.bodyPartMeasurements.bodyPartId, Schema.bodyParts.id))
      .where(eq(Schema.bodyPartMeasurements.userId, userId))
      .orderBy(
        desc(Schema.bodyPartMeasurements.measuredOn),
        asc(Schema.bodyParts.name),
        desc(Schema.bodyPartMeasurements.createdAt),
      );
  }
}

export const ListBodyPartMeasurementExportRowsQuery = new ListBodyPartMeasurementExportRowsQueryDrizzle();
