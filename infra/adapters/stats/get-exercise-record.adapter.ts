import type * as tools from "@bgord/tools";
import { and, asc, desc, eq, isNotNull, sql } from "drizzle-orm";
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
    const completedAt = sql<tools.TimestampValueType>`${Schema.statsExerciseSets.completedAt}`;

    const [record] = await db
      .select({
        reps: Schema.statsExerciseSets.reps,
        load: Schema.statsExerciseSets.load,
        workoutId: Schema.statsExerciseSets.workoutId,
        completedAt,
      })
      .from(Schema.statsExerciseSets)
      .where(
        and(
          eq(Schema.statsExerciseSets.exerciseId, exerciseId),
          eq(Schema.statsExerciseSets.userId, userId),
          isNotNull(Schema.statsExerciseSets.completedAt),
        ),
      )
      .orderBy(
        desc(Schema.statsExerciseSets.load),
        desc(Schema.statsExerciseSets.reps),
        asc(Schema.statsExerciseSets.completedAt),
        asc(Schema.statsExerciseSets.loggedAt),
      )
      .limit(1);

    return record;
  }
}

export const GetExerciseRecordQuery = new GetExerciseRecordQueryDrizzle();
