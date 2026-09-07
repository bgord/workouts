import * as tools from "@bgord/tools";
import { desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Plans from "+plans";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListPlansQueryDrizzle implements Plans.Queries.ListPlans {
  async execute(userId: Auth.VO.UserIdType): Promise<Plans.Queries.PlanListResponse> {
    const plans = await db
      .select()
      .from(Schema.plans)
      .where(eq(Schema.plans.userId, userId))
      .orderBy(desc(Schema.plans.updatedAt));

    const data = plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      status: plan.status,
      revision: plan.revision,
    }));

    const editable = data.filter((plan) => plan.status !== Plans.VO.PlanStatusEnum.archived);

    const hints = {
      create: Plans.Invariants.PlanLimitForOwner.passes({ count: tools.Int.nonNegative(editable.length) })
        ? null
        : "plan.list.limit.hint",
    };

    return { data, hints };
  }
}

export const ListPlansQuery = new ListPlansQueryDrizzle();
