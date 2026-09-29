import { asc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListBodyPartsQueryDrizzle implements Measurements.Queries.ListBodyParts {
  async execute(userId: Auth.VO.UserIdType): Promise<Measurements.Queries.BodyPartListResponse> {
    const bodyParts = await db
      .select({
        id: Schema.bodyParts.id,
        name: Schema.bodyParts.name,
        userId: Schema.bodyParts.userId,
        archivedAt: Schema.bodyParts.archivedAt,
      })
      .from(Schema.bodyParts)
      .where(eq(Schema.bodyParts.userId, userId))
      .orderBy(asc(Schema.bodyParts.name));

    const data = bodyParts.map((bodyPart) => ({
      ...bodyPart,
      actions: new Measurements.Services.BodyPartListItemActions(bodyPart).calculate(),
    }));

    return { data, actions: new Measurements.Services.BodyPartListActions({ bodyParts }).calculate() };
  }
}

export const ListBodyPartsQuery = new ListBodyPartsQueryDrizzle();
