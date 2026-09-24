import type * as tools from "@bgord/tools";
import { and, desc, eq, like, lt } from "drizzle-orm";
import * as v from "valibot";
import type * as Auth from "+auth";
import * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListBodyWeightMeasurementsForMonthQueryDrizzle
  implements Measurements.Queries.ListBodyWeightMeasurementsForMonth
{
  async execute(userId: Auth.VO.UserIdType, month: tools.MonthIsoIdType) {
    const [measurements, [previous]] = await Promise.all([
      db
        .select()
        .from(Schema.bodyWeightMeasurements)
        .where(
          and(
            eq(Schema.bodyWeightMeasurements.userId, userId),
            like(Schema.bodyWeightMeasurements.measuredOn, `${month}-%`),
          ),
        )
        .orderBy(
          desc(Schema.bodyWeightMeasurements.measuredOn),
          desc(Schema.bodyWeightMeasurements.createdAt),
        ),
      db
        .select()
        .from(Schema.bodyWeightMeasurements)
        .where(
          and(
            eq(Schema.bodyWeightMeasurements.userId, userId),
            lt(
              Schema.bodyWeightMeasurements.measuredOn,
              v.parse(Measurements.VO.BodyWeightMeasuredOn, `${month}-01`),
            ),
          ),
        )
        .orderBy(
          desc(Schema.bodyWeightMeasurements.measuredOn),
          desc(Schema.bodyWeightMeasurements.createdAt),
        )
        .limit(1),
    ]);

    return { measurements, previous: previous ?? null };
  }
}

export const ListBodyWeightMeasurementsForMonthQuery = new ListBodyWeightMeasurementsForMonthQueryDrizzle();
