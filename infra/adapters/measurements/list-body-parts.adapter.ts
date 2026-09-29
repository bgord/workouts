import { and, asc, eq, isNotNull, isNull, lte, sql } from "drizzle-orm";
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

    const columns = {
      id: Schema.bodyParts.id,
      name: Schema.bodyParts.name,
      userId: Schema.bodyParts.userId,
      archivedAt: Schema.bodyParts.archivedAt,
    };

    const [active, archived, measurements] = await Promise.all([
      db
        .select(columns)
        .from(Schema.bodyParts)
        .where(and(eq(Schema.bodyParts.userId, userId), isNull(Schema.bodyParts.archivedAt)))
        .orderBy(asc(Schema.bodyParts.name)),
      db
        .select(columns)
        .from(Schema.bodyParts)
        .where(and(eq(Schema.bodyParts.userId, userId), isNotNull(Schema.bodyParts.archivedAt)))
        .orderBy(asc(Schema.bodyParts.name)),
      db
        .select({
          id: ranked.id,
          bodyPartId: ranked.bodyPartId,
          value: ranked.value,
          measuredOn: ranked.measuredOn,
        })
        .from(ranked)
        .where(lte(ranked.rank, 2))
        .orderBy(asc(ranked.bodyPartId), asc(ranked.rank)),
    ]);

    const summaries = new Measurements.Services.BodyPartSummaries({
      bodyParts: active,
      measurements,
    }).calculate();

    return {
      data: {
        active: summaries.map((bodyPart) => ({
          ...bodyPart,
          actions: new Measurements.Services.BodyPartListItemActions(bodyPart).calculate(),
        })),
        archived: archived.map((bodyPart) => ({
          ...bodyPart,
          actions: new Measurements.Services.BodyPartListItemActions(bodyPart).calculate(),
        })),
      },
      actions: new Measurements.Services.BodyPartListActions({ active }).calculate(),
    };
  }
}

export const ListBodyPartsQuery = new ListBodyPartsQueryDrizzle();
