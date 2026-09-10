import { and, asc, eq, isNotNull } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListExercisePerformancesQueryDrizzle implements Workouts.Queries.ListExercisePerformances {
  async execute(
    userId: Auth.VO.UserIdType,
    exerciseId: Exercises.VO.ExerciseIdType,
  ): Promise<Array<Workouts.Queries.ExercisePerformance>> {
    const rows = await db
      .select({
        workoutId: Schema.workoutLoggedSets.workoutId,
        performedAt: Schema.workouts.completedAt,
        setNumber: Schema.workoutLoggedSets.setNumber,
        reps: Schema.workoutLoggedSets.reps,
        load: Schema.workoutLoggedSets.load,
      })
      .from(Schema.workoutLoggedSets)
      .innerJoin(
        Schema.workoutExercises,
        eq(Schema.workoutLoggedSets.workoutExerciseId, Schema.workoutExercises.id),
      )
      .innerJoin(Schema.workouts, eq(Schema.workoutLoggedSets.workoutId, Schema.workouts.id))
      .where(
        and(
          eq(Schema.workoutLoggedSets.userId, userId),
          eq(Schema.workoutExercises.exerciseId, exerciseId),
          eq(Schema.workouts.status, Workouts.VO.WorkoutStatusEnum.completed),
          isNotNull(Schema.workouts.completedAt),
        ),
      )
      .orderBy(asc(Schema.workouts.completedAt), asc(Schema.workoutLoggedSets.setNumber));

    return [...Map.groupBy(rows, (row) => row.workoutId)].map(([workoutId, rows]) => ({
      workoutId,
      performedAt: rows[0]!.performedAt!,
      sets: rows.map((row) => ({ setNumber: row.setNumber, reps: row.reps, load: row.load })),
    }));
  }
}

export const ListExercisePerformancesQuery = new ListExercisePerformancesQueryDrizzle();
