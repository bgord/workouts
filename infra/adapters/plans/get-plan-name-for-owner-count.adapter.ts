import * as tools from "@bgord/tools";
import { and, eq, ne } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Plans from "+plans";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetPlanNameForOwnerCountQueryDrizzle implements Plans.Queries.GetPlanNameForOwnerCount {
  async execute(
    planName: Plans.VO.PlanNameType,
    userId: Auth.VO.UserIdType,
    excludedPlanId?: Plans.VO.PlanIdType,
  ): Promise<tools.IntegerNonNegativeType> {
    const rows = await db
      .select({ name: Schema.plans.name })
      .from(Schema.plans)
      .where(
        and(
          eq(Schema.plans.userId, userId),
          excludedPlanId ? ne(Schema.plans.id, excludedPlanId) : undefined,
        ),
      );

    const name = planName.toLowerCase();

    return tools.Int.nonNegative(rows.filter((row) => row.name.toLowerCase() === name).length);
  }
}

export const GetPlanNameForOwnerCountQuery = new GetPlanNameForOwnerCountQueryDrizzle();
