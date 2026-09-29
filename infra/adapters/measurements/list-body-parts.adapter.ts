import { asc, eq, lte, sql } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListBodyPartsQueryDrizzle implements Measurements.Queries.ListBodyParts {
  async execute(userId: Auth.VO.UserIdType): Promise<Measurements.Queries.BodyPartListResponse> {
    const ranked = db
      .select({
        id: Schema.bodyPartMeasurements.id,
        bodyPartId: Schema.bodyPartMeasurements.bodyPartId,
        value: Schema.bodyPartMeasurements.value,
        measuredOn: Schema.bodyPartMeasurements.measuredOn,
        rank: sql<number>`row_number() over (
          partition by ${Schema.bodyPartMeasurements.bodyPartId}
          order by ${Schema.bodyPartMeasurements.measuredOn} desc, ${Schema.bodyPartMeasurements.createdAt} desc
        )`.as("rank"),
      })
      .from(Schema.bodyPartMeasurements)
      .where(eq(Schema.bodyPartMeasurements.userId, userId))
      .as("ranked");

    const [bodyParts, measurements] = await Promise.all([
      db
        .select({ id: Schema.bodyParts.id, name: Schema.bodyParts.name, userId: Schema.bodyParts.userId })
        .from(Schema.bodyParts)
        .where(eq(Schema.bodyParts.userId, userId))
        .orderBy(asc(Schema.bodyParts.name)),
      db
        .select({
          id: ranked.id,
          bodyPartId: ranked.bodyPartId,
          value: ranked.value,
          measuredOn: ranked.measuredOn,
        })
        .from(ranked)
        .where(lte(ranked.rank, Measurements.VO.BodyPartSummarySeriesSize))
        .orderBy(asc(ranked.bodyPartId), asc(ranked.rank)),
    ]);

    const data = new Measurements.Services.BodyPartSummaries({ bodyParts, measurements }).calculate();

    return {
      data,
      actions: new Measurements.Services.BodyPartListActions({ bodyParts }).calculate(),
    };
  }
}

export const ListBodyPartsQuery = new ListBodyPartsQueryDrizzle();
