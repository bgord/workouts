import * as tools from "@bgord/tools";
import { eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetWorkoutForOwnerCountQueryDrizzle implements Workouts.Queries.GetWorkoutForOwnerCount {
  async execute(userId: Auth.VO.UserIdType): Promise<tools.IntegerNonNegativeType> {
    const count = await db.$count(Schema.workouts, eq(Schema.workouts.userId, userId));

    return tools.Int.nonNegative(count);
  }
}

export const GetWorkoutForOwnerCountQuery = new GetWorkoutForOwnerCountQueryDrizzle();
