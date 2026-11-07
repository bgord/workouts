import { eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetBodyPartByNameQueryDrizzle implements Measurements.Queries.GetBodyPartByName {
  async execute(
    userId: Auth.VO.UserIdType,
    bodyPartName: Measurements.VO.BodyPartNameType,
  ): Promise<Measurements.VO.BodyPart | null> {
    const bodyParts = await db.select().from(Schema.bodyParts).where(eq(Schema.bodyParts.userId, userId));

    const name = bodyPartName.toLowerCase();

    return bodyParts.find((bodyPart) => bodyPart.name.toLowerCase() === name) ?? null;
  }
}

export const GetBodyPartByNameQuery = new GetBodyPartByNameQueryDrizzle();
