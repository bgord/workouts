import { and, asc, desc, eq, isNotNull } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as Stats from "+stats";
import type * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetExerciseHistoryQueryDrizzle implements Stats.Queries.GetExerciseHistory {
  async execute(
    exerciseId: Exercises.VO.ExerciseIdType,
    userId: Auth.VO.UserIdType,
  ): Promise<Array<Stats.VO.ExerciseSession>> {
    const loggedSets = await db
      .select()
      .from(Schema.statsExerciseSets)
      .where(
        and(
          eq(Schema.statsExerciseSets.exerciseId, exerciseId),
          eq(Schema.statsExerciseSets.userId, userId),
          isNotNull(Schema.statsExerciseSets.completedAt),
        ),
      )
      .orderBy(desc(Schema.statsExerciseSets.completedAt), asc(Schema.statsExerciseSets.loggedAt));

    const sessions = new Map<Workouts.VO.WorkoutIdType, Stats.VO.ExerciseSession>();

    for (const loggedSet of loggedSets) {
      if (loggedSet.completedAt === null) continue;

      const session = sessions.get(loggedSet.workoutId) ?? {
        workoutId: loggedSet.workoutId,
        completedAt: loggedSet.completedAt,
        sets: [],
      };

      session.sets.push({ reps: loggedSet.reps, load: loggedSet.load });

      sessions.set(loggedSet.workoutId, session);
    }

    return [...sessions.values()];
  }
}

export const GetExerciseHistoryQuery = new GetExerciseHistoryQueryDrizzle();
