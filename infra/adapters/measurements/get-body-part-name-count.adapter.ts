import * as tools from "@bgord/tools";
import { and, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetBodyPartNameCountQueryDrizzle implements Measurements.Queries.GetBodyPartNameCount {
  async execute(
    userId: Auth.VO.UserIdType,
    bodyPartName: Measurements.VO.BodyPartNameType,
  ): Promise<tools.IntegerNonNegativeType> {
    const count = await db.$count(
      Schema.bodyParts,
      and(eq(Schema.bodyParts.userId, userId), eq(Schema.bodyParts.name, bodyPartName)),
    );

    return tools.Int.nonNegative(count);
  }
}

export const GetBodyPartNameCountQuery = new GetBodyPartNameCountQueryDrizzle();
