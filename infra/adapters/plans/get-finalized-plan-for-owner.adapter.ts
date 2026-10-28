import { and, asc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Plans from "+plans";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetFinalizedPlanForOwnerQueryDrizzle implements Plans.Queries.GetFinalizedPlanForOwner {
  async execute(userId: Auth.VO.UserIdType): Promise<Plans.Queries.FinalizedPlanForOwner | null> {
    const plan = await db.query.plans.findFirst({
      columns: { id: true, name: true },
      where: and(eq(Schema.plans.userId, userId), eq(Schema.plans.status, Plans.VO.PlanStatusEnum.finalized)),
      with: {
        sections: {
          columns: { id: true, name: true },
          orderBy: asc(Schema.planSections.createdAt),
          with: {
            exerciseInstructions: {
              columns: { id: true },
              orderBy: asc(Schema.planSectionExerciseInstructions.position),
              with: { exercise: { columns: { name: true } } },
            },
          },
        },
      },
    });

    return plan ?? null;
  }
}

export const GetFinalizedPlanForOwnerQuery = new GetFinalizedPlanForOwnerQueryDrizzle();
