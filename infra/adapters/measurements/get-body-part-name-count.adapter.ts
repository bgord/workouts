import * as tools from "@bgord/tools";
import { and, eq, ne } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetBodyPartNameCountQueryDrizzle implements Measurements.Queries.GetBodyPartNameCount {
  async execute(
    userId: Auth.VO.UserIdType,
    bodyPartName: Measurements.VO.BodyPartNameType,
    excludedBodyPartId?: Measurements.VO.BodyPartIdType,
  ): Promise<tools.IntegerNonNegativeType> {
    const rows = await db
      .select({ name: Schema.bodyParts.name })
      .from(Schema.bodyParts)
      .where(
        and(
          eq(Schema.bodyParts.userId, userId),
          excludedBodyPartId ? ne(Schema.bodyParts.id, excludedBodyPartId) : undefined,
        ),
      );

    const name = bodyPartName.toLowerCase();

    return tools.Int.nonNegative(rows.filter((row) => row.name.toLowerCase() === name).length);
  }
}

export const GetBodyPartNameCountQuery = new GetBodyPartNameCountQueryDrizzle();
