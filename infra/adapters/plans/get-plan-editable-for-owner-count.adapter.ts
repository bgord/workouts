import * as tools from "@bgord/tools";
import { and, eq, not } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Plans from "+plans";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetPlanEditableForOwnerCountQueryDrizzle implements Plans.Queries.GetPlanEditableForOwnerCount {
  async execute(userId: Auth.VO.UserIdType): Promise<tools.IntegerNonNegativeType> {
    const count = await db.$count(
      Schema.plans,
      and(eq(Schema.plans.userId, userId), not(eq(Schema.plans.status, Plans.VO.PlanStatusEnum.archived))),
    );

    return tools.Int.nonNegative(count);
  }
}

export const GetPlanEditableForOwnerCountQuery = new GetPlanEditableForOwnerCountQueryDrizzle();
