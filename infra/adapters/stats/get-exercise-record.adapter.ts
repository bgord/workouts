import { and, asc, desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as Stats from "+stats";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetExerciseRecordQueryDrizzle implements Stats.Queries.GetExerciseRecord {
  async execute(
    exerciseId: Exercises.VO.ExerciseIdType,
    userId: Auth.VO.UserIdType,
  ): Promise<Stats.VO.ExerciseRecord | undefined> {
    const [record] = await db
      .select({
        reps: Schema.statsExerciseSessions.topSetReps,
        load: Schema.statsExerciseSessions.topSetLoad,
        workoutId: Schema.statsExerciseSessions.workoutId,
        completedAt: Schema.statsExerciseSessions.completedAt,
      })
      .from(Schema.statsExerciseSessions)
      .where(
        and(
          eq(Schema.statsExerciseSessions.exerciseId, exerciseId),
          eq(Schema.statsExerciseSessions.userId, userId),
        ),
      )
      .orderBy(
        desc(Schema.statsExerciseSessions.topSetLoad),
        desc(Schema.statsExerciseSessions.topSetReps),
        asc(Schema.statsExerciseSessions.completedAt),
      )
      .limit(1);

    return record;
  }
}

export const GetExerciseRecordQuery = new GetExerciseRecordQueryDrizzle();
