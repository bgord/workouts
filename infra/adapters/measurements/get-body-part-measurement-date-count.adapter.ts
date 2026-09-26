import * as tools from "@bgord/tools";
import { and, eq, ne } from "drizzle-orm";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetBodyPartMeasurementDateCountQueryDrizzle
  implements Measurements.Queries.GetBodyPartMeasurementDateCount
{
  async execute(
    userId: Measurements.VO.BodyPart["userId"],
    bodyPartId: Measurements.VO.BodyPartIdType,
    measuredOn: Measurements.VO.BodyPartMeasuredOnType,
    exceptId?: Measurements.VO.BodyPartMeasurementIdType,
  ): Promise<number> {
    return db
      .$count(
        Schema.bodyPartMeasurements,
        and(
          eq(Schema.bodyPartMeasurements.userId, userId),
          eq(Schema.bodyPartMeasurements.bodyPartId, bodyPartId),
          eq(Schema.bodyPartMeasurements.measuredOn, measuredOn),
          exceptId ? ne(Schema.bodyPartMeasurements.id, exceptId) : undefined,
        ),
      )
      .then((count) => tools.Int.nonNegative(count));
  }
}

export const GetBodyPartMeasurementDateCountQuery = new GetBodyPartMeasurementDateCountQueryDrizzle();
