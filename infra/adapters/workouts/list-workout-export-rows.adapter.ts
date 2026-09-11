import { and, asc, eq, isNotNull } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListWorkoutExportRowsQueryDrizzle implements Workouts.Queries.ListWorkoutExportRows {
  async execute(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<Workouts.Queries.WorkoutExportRow>> {
    const rows = await db
      .select({
        workoutId: Schema.workoutLoggedSets.workoutId,
        completedAt: Schema.workouts.completedAt,
        planName: Schema.workouts.planName,
        planSectionName: Schema.workouts.planSectionName,
        exerciseName: Schema.workoutExercises.exerciseName,
        setNumber: Schema.workoutLoggedSets.setNumber,
        reps: Schema.workoutLoggedSets.reps,
        load: Schema.workoutLoggedSets.load,
        rir: Schema.workoutLoggedSets.rir,
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
          eq(Schema.workouts.status, Workouts.VO.WorkoutStatusEnum.completed),
          isNotNull(Schema.workouts.completedAt),
        ),
      )
      .orderBy(
        asc(Schema.workouts.completedAt),
        asc(Schema.workoutExercises.createdAt),
        asc(Schema.workoutLoggedSets.setNumber),
      );

    return rows.map((row) => ({ ...row, completedAt: row.completedAt!, rir: row.rir ?? undefined }));
  }
}

export const ListWorkoutExportRowsQuery = new ListWorkoutExportRowsQueryDrizzle();
