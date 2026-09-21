import * as tools from "@bgord/tools";
import { and, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetWorkoutStatusForOwnerCountQueryDrizzle implements Workouts.Queries.GetWorkoutStatusForOwnerCount {
  async execute(
    userId: Auth.VO.UserIdType,
    status: Workouts.VO.WorkoutStatusEnum,
  ): Promise<tools.IntegerNonNegativeType> {
    const count = await db.$count(
      Schema.workouts,
      and(eq(Schema.workouts.userId, userId), eq(Schema.workouts.status, status)),
    );

    return tools.Int.nonNegative(count);
  }
}

export const GetWorkoutStatusForOwnerCountQuery = new GetWorkoutStatusForOwnerCountQueryDrizzle();
