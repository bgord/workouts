import * as tools from "@bgord/tools";
import { and, eq, ne } from "drizzle-orm";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetBodyPartNameCountQueryDrizzle implements Measurements.Queries.GetBodyPartNameCount {
  async execute(
    userId: Measurements.VO.BodyPart["userId"],
    name: Measurements.VO.BodyPartNameType,
    exceptId?: Measurements.VO.BodyPartIdType,
  ): Promise<number> {
    return db
      .$count(
        Schema.bodyParts,
        and(
          eq(Schema.bodyParts.userId, userId),
          eq(Schema.bodyParts.normalizedName, name.toLowerCase()),
          eq(Schema.bodyParts.archived, false),
          exceptId ? ne(Schema.bodyParts.id, exceptId) : undefined,
        ),
      )
      .then((count) => tools.Int.nonNegative(count));
  }
}

export const GetBodyPartNameCountQuery = new GetBodyPartNameCountQueryDrizzle();
