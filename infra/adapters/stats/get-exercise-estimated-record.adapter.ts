import { and, asc, desc, eq, isNotNull } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as Stats from "+stats";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetExerciseEstimatedRecordQueryDrizzle implements Stats.Queries.GetExerciseEstimatedRecord {
  async execute(
    exerciseId: Exercises.VO.ExerciseIdType,
    userId: Auth.VO.UserIdType,
  ): Promise<Stats.VO.EstimatedRecord | undefined> {
    const [session] = await db
      .select({
        reps: Schema.statsExerciseSessions.oneRepMaxEstimateReps,
        load: Schema.statsExerciseSessions.oneRepMaxEstimateLoad,
        workoutId: Schema.statsExerciseSessions.workoutId,
        completedAt: Schema.statsExerciseSessions.completedAt,
        oneRepMaxEstimate: Schema.statsExerciseSessions.oneRepMaxEstimate,
      })
      .from(Schema.statsExerciseSessions)
      .where(
        and(
          eq(Schema.statsExerciseSessions.exerciseId, exerciseId),
          eq(Schema.statsExerciseSessions.userId, userId),
          isNotNull(Schema.statsExerciseSessions.oneRepMaxEstimate),
        ),
      )
      .orderBy(
        desc(Schema.statsExerciseSessions.oneRepMaxEstimate),
        asc(Schema.statsExerciseSessions.completedAt),
      )
      .limit(1);

    if (session === undefined) return undefined;
    if (session.oneRepMaxEstimate === null) return undefined;
    if (session.reps === null || session.load === null) return undefined;

    return {
      reps: session.reps,
      load: session.load,
      workoutId: session.workoutId,
      completedAt: session.completedAt,
      oneRepMaxEstimate: session.oneRepMaxEstimate,
    };
  }
}

export const GetExerciseEstimatedRecordQuery = new GetExerciseEstimatedRecordQueryDrizzle();
