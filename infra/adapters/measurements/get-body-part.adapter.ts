import { eq } from "drizzle-orm";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetBodyPartQueryDrizzle implements Measurements.Queries.GetBodyPart {
  async execute(id: Measurements.VO.BodyPartIdType): Promise<Measurements.VO.BodyPart | null> {
    const bodyPart = await db.select().from(Schema.bodyParts).where(eq(Schema.bodyParts.id, id)).get();

    return bodyPart ?? null;
  }
}

export const GetBodyPartQuery = new GetBodyPartQueryDrizzle();
