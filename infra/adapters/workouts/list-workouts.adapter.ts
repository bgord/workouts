import { desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListWorkoutsQueryDrizzle implements Workouts.Queries.ListWorkouts {
  async execute(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<Workouts.VO.WorkoutSummary>> {
    const workouts = await db
      .select()
      .from(Schema.workouts)
      .where(eq(Schema.workouts.userId, userId))
      .orderBy(desc(Schema.workouts.scheduledFor));

    return workouts.map((workout) => ({
      id: workout.id,
      planId: workout.planId,
      planName: workout.planName,
      planSectionId: workout.planSectionId,
      planSectionName: workout.planSectionName,
      scheduledFor: workout.scheduledFor,
      status: workout.status,
      completedAt: workout.completedAt ?? undefined,
      revision: workout.revision,
    }));
  }
}

export const ListWorkoutsQuery = new ListWorkoutsQueryDrizzle();
