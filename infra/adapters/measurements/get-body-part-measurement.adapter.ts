import { eq } from "drizzle-orm";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetBodyPartMeasurementQueryDrizzle implements Measurements.Queries.GetBodyPartMeasurement {
  async execute(
    id: Measurements.VO.BodyPartMeasurementIdType,
  ): Promise<Measurements.VO.BodyPartMeasurement | null> {
    const measurement = await db
      .select()
      .from(Schema.bodyPartMeasurements)
      .where(eq(Schema.bodyPartMeasurements.id, id))
      .get();

    return measurement ?? null;
  }
}

export const GetBodyPartMeasurementQuery = new GetBodyPartMeasurementQueryDrizzle();
