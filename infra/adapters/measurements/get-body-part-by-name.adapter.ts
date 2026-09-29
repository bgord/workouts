import { and, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetBodyPartByNameQueryDrizzle implements Measurements.Queries.GetBodyPartByName {
  async execute(
    userId: Auth.VO.UserIdType,
    bodyPartName: Measurements.VO.BodyPartNameType,
  ): Promise<Measurements.VO.BodyPart | null> {
    const bodyPart = await db
      .select()
      .from(Schema.bodyParts)
      .where(and(eq(Schema.bodyParts.userId, userId), eq(Schema.bodyParts.name, bodyPartName)))
      .get();

    return bodyPart ?? null;
  }
}

export const GetBodyPartByNameQuery = new GetBodyPartByNameQueryDrizzle();
