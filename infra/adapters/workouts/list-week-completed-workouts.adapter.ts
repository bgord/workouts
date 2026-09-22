import * as tools from "@bgord/tools";
import { and, asc, between, eq, isNotNull } from "drizzle-orm";
import * as v from "valibot";
import type * as Auth from "+auth";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListWeekCompletedWorkoutsQueryDrizzle implements Workouts.Queries.ListWeekCompletedWorkouts {
  async execute(
    userId: Auth.VO.UserIdType,
    week: tools.Week,
  ): Promise<ReadonlyArray<Workouts.Queries.WeekCompletedWorkout>> {
    const start = v.parse(
      Workouts.VO.WorkoutScheduledFor,
      tools.Day.fromTimestamp(week.getStart()).toIsoId(),
    );
    const end = v.parse(Workouts.VO.WorkoutScheduledFor, tools.Day.fromTimestamp(week.getEnd()).toIsoId());

    const completed = and(
      eq(Schema.workouts.userId, userId),
      eq(Schema.workouts.status, Workouts.VO.WorkoutStatusEnum.completed),
      isNotNull(Schema.workouts.completedAt),
      between(Schema.workouts.scheduledFor, start, end),
    );

    const [workouts, sets] = await Promise.all([
      db
        .select({
          id: Schema.workouts.id,
          planName: Schema.workouts.planName,
          planSectionName: Schema.workouts.planSectionName,
          scheduledFor: Schema.workouts.scheduledFor,
        })
        .from(Schema.workouts)
        .where(completed)
        .orderBy(asc(Schema.workouts.scheduledFor), asc(Schema.workouts.completedAt)),
      db
        .select({
          workoutId: Schema.workoutLoggedSets.workoutId,
          reps: Schema.workoutLoggedSets.reps,
          load: Schema.workoutLoggedSets.load,
        })
        .from(Schema.workoutLoggedSets)
        .innerJoin(Schema.workouts, eq(Schema.workoutLoggedSets.workoutId, Schema.workouts.id))
        .where(completed)
        .orderBy(asc(Schema.workoutLoggedSets.createdAt)),
    ]);

    const setsByWorkout = Map.groupBy(sets, (set) => set.workoutId);

    return workouts.map((workout) => ({
      ...workout,
      sets: (setsByWorkout.get(workout.id) ?? []).map((set) => ({ reps: set.reps, load: set.load })),
    }));
  }
}

export const ListWeekCompletedWorkoutsQuery = new ListWeekCompletedWorkoutsQueryDrizzle();
