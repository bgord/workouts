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
  ): Promise<Stats.VO.ExerciseHistory> {
    const completedSets = and(
      eq(Schema.statsExerciseSets.exerciseId, exerciseId),
      eq(Schema.statsExerciseSets.userId, userId),
      isNotNull(Schema.statsExerciseSets.completedAt),
    );

    const [loggedSets, [record]] = await Promise.all([
      db
        .select()
        .from(Schema.statsExerciseSets)
        .where(completedSets)
        .orderBy(desc(Schema.statsExerciseSets.completedAt), asc(Schema.statsExerciseSets.loggedAt)),
      db
        .select({
          reps: Schema.statsExerciseSets.reps,
          load: Schema.statsExerciseSets.load,
          workoutId: Schema.statsExerciseSets.workoutId,
          completedAt: Schema.statsExerciseSets.completedAt,
        })
        .from(Schema.statsExerciseSets)
        .where(completedSets)
        .orderBy(
          desc(Schema.statsExerciseSets.load),
          desc(Schema.statsExerciseSets.reps),
          asc(Schema.statsExerciseSets.completedAt),
          asc(Schema.statsExerciseSets.loggedAt),
        )
        .limit(1),
    ]);

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

    const history = [...sessions.values()];

    if (!record || record.completedAt === null) return { sessions: history };

    return { sessions: history, record: { ...record, completedAt: record.completedAt } };
  }
}

export const createGetExerciseHistoryQuery = () => new GetExerciseHistoryQueryDrizzle();
