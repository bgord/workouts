import { asc, eq } from "drizzle-orm";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListBodyPartsQueryDrizzle implements Measurements.Queries.ListBodyParts {
  async execute(
    userId: Measurements.VO.BodyPart["userId"],
  ): Promise<ReadonlyArray<Measurements.VO.BodyPart>> {
    return db
      .select()
      .from(Schema.bodyParts)
      .where(eq(Schema.bodyParts.userId, userId))
      .orderBy(asc(Schema.bodyParts.name));
  }
}

export const ListBodyPartsQuery = new ListBodyPartsQueryDrizzle();
