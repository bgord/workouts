import { eq } from "drizzle-orm";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetBodyWeightMeasurementQueryDrizzle implements Measurements.Queries.GetBodyWeightMeasurement {
  async execute(
    id: Measurements.VO.BodyWeightMeasurementIdType,
  ): Promise<Measurements.VO.BodyWeightMeasurement | null> {
    const [measurement] = await db
      .select()
      .from(Schema.bodyWeightMeasurements)
      .where(eq(Schema.bodyWeightMeasurements.id, id))
      .limit(1);

    return measurement ?? null;
  }
}

export const GetBodyWeightMeasurementQuery = new GetBodyWeightMeasurementQueryDrizzle();
