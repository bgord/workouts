import type * as tools from "@bgord/tools";
import { and, desc, eq, like, lt } from "drizzle-orm";
import * as v from "valibot";
import type * as Auth from "+auth";
import * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListBodyPartMeasurementsForMonthQueryDrizzle
  implements Measurements.Queries.ListBodyPartMeasurementsForMonth
{
  async execute(
    userId: Auth.VO.UserIdType,
    month: tools.MonthIsoIdType,
  ): Promise<{
    measurements: ReadonlyArray<Measurements.VO.BodyPartMeasurement>;
    previous: Measurements.VO.BodyPartMeasurement | null;
  }> {
    const [measurements, [previous]] = await Promise.all([
      db
        .select()
        .from(Schema.bodyPartMeasurements)
        .where(
          and(
            eq(Schema.bodyPartMeasurements.userId, userId),
            like(Schema.bodyPartMeasurements.measuredOn, `${month}-%`),
          ),
        )
        .orderBy(desc(Schema.bodyPartMeasurements.measuredOn), desc(Schema.bodyPartMeasurements.createdAt)),
      db
        .select()
        .from(Schema.bodyPartMeasurements)
        .where(
          and(
            eq(Schema.bodyPartMeasurements.userId, userId),
            lt(
              Schema.bodyPartMeasurements.measuredOn,
              v.parse(Measurements.VO.BodyPartMeasuredOn, `${month}-01`),
            ),
          ),
        )
        .orderBy(desc(Schema.bodyPartMeasurements.measuredOn), desc(Schema.bodyPartMeasurements.createdAt))
        .limit(1),
    ]);

    return { measurements, previous: previous ?? null };
  }
}

export const ListBodyPartMeasurementsForMonthQuery = new ListBodyPartMeasurementsForMonthQueryDrizzle();
