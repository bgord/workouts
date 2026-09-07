import * as tools from "@bgord/tools";
import { desc, eq } from "drizzle-orm";
import type { ActionState } from "+action-state";
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

    const summaries = plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      status: plan.status,
      revision: plan.revision,
    }));

    const active = summaries.filter((plan) => plan.status !== Plans.VO.PlanStatusEnum.archived);
    const archived = summaries.filter((plan) => plan.status === Plans.VO.PlanStatusEnum.archived);

    const create: ActionState = Plans.Invariants.PlanLimitForOwner.passes({
      count: tools.Int.nonNegative(active.length),
    })
      ? { enabled: true, hints: [] }
      : { enabled: false, hints: ["plan.list.limit.hint"] };

    return { data: { active, archived }, actions: { create } };
  }
}

export const ListPlansQuery = new ListPlansQueryDrizzle();
