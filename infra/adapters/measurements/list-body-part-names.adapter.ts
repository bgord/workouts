import { asc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListBodyPartNamesQueryDrizzle implements Measurements.Queries.ListBodyPartNames {
  async execute(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<Measurements.VO.BodyPartNameType>> {
    const bodyParts = await db
      .select({ name: Schema.bodyParts.name })
      .from(Schema.bodyParts)
      .where(eq(Schema.bodyParts.userId, userId))
      .orderBy(asc(Schema.bodyParts.name));

    return bodyParts.map((bodyPart) => bodyPart.name);
  }
}

export const ListBodyPartNamesQuery = new ListBodyPartNamesQueryDrizzle();
