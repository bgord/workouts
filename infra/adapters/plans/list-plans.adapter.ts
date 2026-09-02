import { desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Plans from "+plans";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListPlansQueryDrizzle implements Plans.Queries.ListPlans {
  async execute(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<Plans.VO.PlanSummary>> {
    const plans = await db
      .select()
      .from(Schema.plans)
      .where(eq(Schema.plans.userId, userId))
      .orderBy(desc(Schema.plans.updatedAt));

    return plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      status: plan.status,
      revision: plan.revision,
    }));
  }
}

export const ListPlansQuery = new ListPlansQueryDrizzle();
