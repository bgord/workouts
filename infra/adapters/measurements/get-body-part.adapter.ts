import { eq } from "drizzle-orm";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetBodyPartQueryDrizzle implements Measurements.Queries.GetBodyPart {
  async execute(bodyPartId: Measurements.VO.BodyPartIdType): Promise<Measurements.VO.BodyPart | null> {
    const bodyPart = await db
      .select({ id: Schema.bodyParts.id, name: Schema.bodyParts.name, userId: Schema.bodyParts.userId })
      .from(Schema.bodyParts)
      .where(eq(Schema.bodyParts.id, bodyPartId))
      .get();

    return bodyPart ?? null;
  }
}

export const GetBodyPartQuery = new GetBodyPartQueryDrizzle();
