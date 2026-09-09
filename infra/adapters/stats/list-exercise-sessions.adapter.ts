import { and, desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import * as Stats from "+stats";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListExerciseSessionsQueryDrizzle implements Stats.Queries.ListExerciseSessions {
  async execute(
    exerciseId: Exercises.VO.ExerciseIdType,
    userId: Auth.VO.UserIdType,
  ): Promise<Array<Stats.VO.ExerciseSession>> {
    const sessions = await db
      .select({
        workoutId: Schema.statsExerciseSessions.workoutId,
        completedAt: Schema.statsExerciseSessions.completedAt,
        sets: Schema.statsExerciseSessions.sets,
        volume: Schema.statsExerciseSessions.volume,
        oneRepMaxEstimate: Schema.statsExerciseSessions.oneRepMaxEstimate,
      })
      .from(Schema.statsExerciseSessions)
      .where(
        and(
          eq(Schema.statsExerciseSessions.exerciseId, exerciseId),
          eq(Schema.statsExerciseSessions.userId, userId),
        ),
      )
      .orderBy(desc(Schema.statsExerciseSessions.completedAt));

    const measured = sessions.map((session) => ({
      ...session,
      oneRepMaxEstimate: session.oneRepMaxEstimate ?? undefined,
    }));

    return measured.map((session, order) => {
      const previous = measured.at(order + 1);

      if (previous === undefined) return session;

      return {
        ...session,
        oneRepMaxEstimateDelta: Stats.Services.DeltaCalculator.between(
          session.oneRepMaxEstimate,
          previous.oneRepMaxEstimate,
        ),
        volumeDelta: Stats.Services.DeltaCalculator.between(session.volume, previous.volume),
      };
    });
  }
}

export const ListExerciseSessionsQuery = new ListExerciseSessionsQueryDrizzle();
