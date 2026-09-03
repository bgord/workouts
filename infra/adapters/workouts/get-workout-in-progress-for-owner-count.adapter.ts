import * as tools from "@bgord/tools";
import { and, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetWorkoutInProgressForOwnerCountQueryDrizzle
  implements Workouts.Queries.GetWorkoutInProgressForOwnerCount
{
  async execute(userId: Auth.VO.UserIdType): Promise<tools.IntegerNonNegativeType> {
    const count = await db.$count(
      Schema.workouts,
      and(
        eq(Schema.workouts.userId, userId),
        eq(Schema.workouts.status, Workouts.VO.WorkoutStatusEnum.in_progress),
      ),
    );

    return tools.Int.nonNegative(count);
  }
}

export const GetWorkoutInProgressForOwnerCountQuery = new GetWorkoutInProgressForOwnerCountQueryDrizzle();
