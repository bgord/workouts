import * as tools from "@bgord/tools";
import { count, desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Plans from "+plans";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListPlansQueryDrizzle implements Plans.Queries.ListPlans {
  async execute(userId: Auth.VO.UserIdType): Promise<Plans.Queries.PlanListResponse> {
    const plans = await db
      .select({
        id: Schema.plans.id,
        name: Schema.plans.name,
        description: Schema.plans.description,
        status: Schema.plans.status,
        revision: Schema.plans.revision,
        updatedAt: Schema.plans.updatedAt,
        sections: count(Schema.planSections.id).mapWith(tools.Int.nonNegative),
      })
      .from(Schema.plans)
      .leftJoin(Schema.planSections, eq(Schema.planSections.planId, Schema.plans.id))
      .where(eq(Schema.plans.userId, userId))
      .groupBy(Schema.plans.id)
      .orderBy(desc(Schema.plans.updatedAt));

    const summaries = plans.map((plan) => ({
      ...plan,
      description: plan.description ?? undefined,
    }));

    const active = summaries.filter((plan) => plan.status !== Plans.VO.PlanStatusEnum.archived);
    const archived = summaries.filter((plan) => plan.status === Plans.VO.PlanStatusEnum.archived);

    return {
      data: { active, archived },
      actions: new Plans.Services.PlanListActions({
        activeCount: tools.Int.nonNegative(active.length),
      }).calculate(),
    };
  }
}

export const ListPlansQuery = new ListPlansQueryDrizzle();
