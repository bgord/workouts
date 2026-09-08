import type * as tools from "@bgord/tools";
import { and, asc, desc, eq, isNotNull, sql } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as Stats from "+stats";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

const completedAt = sql<tools.TimestampValueType>`${Schema.statsExerciseSets.completedAt}`;

const performedSets = sql<Array<Stats.VO.PerformedSet>>`json_group_array(
  json_object('reps', ${Schema.statsExerciseSets.reps}, 'load', ${Schema.statsExerciseSets.load})
  order by ${Schema.statsExerciseSets.loggedAt} asc
)`.mapWith(JSON.parse);

class GetExerciseHistoryQueryDrizzle implements Stats.Queries.GetExerciseHistory {
  async execute(
    exerciseId: Exercises.VO.ExerciseIdType,
    userId: Auth.VO.UserIdType,
  ): Promise<Stats.VO.ExerciseHistory> {
    const completed = and(
      eq(Schema.statsExerciseSets.exerciseId, exerciseId),
      eq(Schema.statsExerciseSets.userId, userId),
      isNotNull(Schema.statsExerciseSets.completedAt),
    );

    const [sessions, [record]] = await Promise.all([
      db
        .select({ workoutId: Schema.statsExerciseSets.workoutId, completedAt, sets: performedSets })
        .from(Schema.statsExerciseSets)
        .where(completed)
        .groupBy(Schema.statsExerciseSets.workoutId)
        .orderBy(desc(Schema.statsExerciseSets.completedAt)),
      db
        .select({
          reps: Schema.statsExerciseSets.reps,
          load: Schema.statsExerciseSets.load,
          workoutId: Schema.statsExerciseSets.workoutId,
          completedAt,
        })
        .from(Schema.statsExerciseSets)
        .where(completed)
        .orderBy(
          desc(Schema.statsExerciseSets.load),
          desc(Schema.statsExerciseSets.reps),
          asc(Schema.statsExerciseSets.completedAt),
          asc(Schema.statsExerciseSets.loggedAt),
        )
        .limit(1),
    ]);

    return { sessions, record };
  }
}

export const createGetExerciseHistoryQuery = () => new GetExerciseHistoryQueryDrizzle();
