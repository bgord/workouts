import * as tools from "@bgord/tools";
import { and, asc, between, eq } from "drizzle-orm";
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

    const workouts = await db.query.workouts.findMany({
      columns: { id: true, planName: true, planSectionName: true, scheduledFor: true },
      where: and(
        eq(Schema.workouts.userId, userId),
        eq(Schema.workouts.status, Workouts.VO.WorkoutStatusEnum.completed),
        between(Schema.workouts.scheduledFor, start, end),
      ),
      orderBy: [asc(Schema.workouts.scheduledFor), asc(Schema.workouts.completedAt)],
      with: {
        loggedSets: {
          columns: { reps: true, load: true },
          orderBy: asc(Schema.workoutLoggedSets.createdAt),
          with: { workoutExercise: { columns: { laterality: true } } },
        },
      },
    });

    return workouts.map(({ loggedSets, ...workout }) => ({
      ...workout,
      loggedSets: loggedSets.map(({ workoutExercise, ...loggedSet }) => ({
        ...loggedSet,
        laterality: workoutExercise.laterality,
      })),
    }));
  }
}

export const ListWeekCompletedWorkoutsQuery = new ListWeekCompletedWorkoutsQueryDrizzle();
