import * as tools from "@bgord/tools";
import { and, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Plans from "+plans";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetPlanNameForOwnerCountQueryDrizzle implements Plans.Queries.GetPlanNameForOwnerCount {
  async execute(
    planName: Plans.VO.PlanNameType,
    ownerId: Auth.VO.UserIdType,
  ): Promise<tools.IntegerNonNegativeType> {
    const count = await db.$count(
      Schema.plans,
      and(eq(Schema.plans.name, planName), eq(Schema.plans.ownerId, ownerId)),
    );

    return tools.Int.nonNegative(count);
  }
}

export const GetPlanNameForOwnerCountQuery = new GetPlanNameForOwnerCountQueryDrizzle();
