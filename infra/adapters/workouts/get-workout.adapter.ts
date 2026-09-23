import * as tools from "@bgord/tools";
import { and, asc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { GetExercisePreviousPerformanceQuery } from "./get-exercise-previous-performance.adapter";
import { GetWorkoutStatusForOwnerCountQuery } from "./get-workout-status-for-owner-count.adapter";

class GetWorkoutQueryDrizzle implements Workouts.Queries.GetWorkout {
  async execute(
    workoutId: Workouts.VO.WorkoutIdType,
    userId: Auth.VO.UserIdType,
  ): Promise<Workouts.Queries.WorkoutGetResponse | null> {
    const [workout, inProgressCount] = await Promise.all([
      db.query.workouts.findFirst({
        columns: {
          id: true,
          planId: true,
          planName: true,
          planSectionId: true,
          planSectionName: true,
          planSectionWarmup: true,
          planSectionCooldown: true,
          scheduledFor: true,
          status: true,
          completedAt: true,
          note: true,
          revision: true,
        },
        where: and(eq(Schema.workouts.id, workoutId), eq(Schema.workouts.userId, userId)),
        with: {
          exercises: {
            columns: {
              id: true,
              exerciseId: true,
              exerciseName: true,
              exerciseImageEtag: true,
              exerciseDescription: true,
              prescription: true,
              target: true,
            },
            orderBy: asc(Schema.workoutExercises.position),
            with: {
              loggedSets: {
                columns: { id: true, setNumber: true, reps: true, load: true, rir: true },
                orderBy: asc(Schema.workoutLoggedSets.setNumber),
              },
            },
          },
        },
      }),
      GetWorkoutStatusForOwnerCountQuery.execute(userId, Workouts.VO.WorkoutStatusEnum.in_progress),
    ]);

    if (!workout) return null;

    const data = {
      ...workout,
      exercises: await Promise.all(
        workout.exercises.map(async (exercise) => {
          const previous = await GetExercisePreviousPerformanceQuery.execute(
            userId,
            exercise.exerciseId,
            workout,
          );

          return {
            ...exercise,
            loggedSets: exercise.loggedSets.map((loggedSet) => ({
              ...loggedSet,
              actions: new Workouts.Services.WorkoutGetLoggedSetActions({
                status: workout.status,
                loggedSetCount: tools.Int.nonNegative(
                  workout.exercises.flatMap((exercise) => exercise.loggedSets).length,
                ),
              }).calculate(),
            })),
            previousPerformance: previous && {
              scheduledFor: previous.scheduledFor,
              sets: previous.sets,
              diff:
                exercise.target &&
                new Workouts.Services.ExerciseTargetDiffCalculator(exercise.target, previous).calculate(),
            },
            targetProgression:
              previous &&
              Workouts.Services.ProgressionMethodStrategyFactory.for(
                exercise.prescription,
                previous,
              ).calculate(),
            actions: new Workouts.Services.WorkoutGetExerciseActions({
              status: workout.status,
              exercises: workout.exercises,
              exercise,
            }).calculate(),
          };
        }),
      ),
    };

    return {
      data,
      actions: new Workouts.Services.WorkoutGetActions({
        status: workout.status,
        exercises: data.exercises,
        inProgressCount,
      }).calculate(),
    };
  }
}

export const GetWorkoutQuery = new GetWorkoutQueryDrizzle();
