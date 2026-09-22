import * as tools from "@bgord/tools";
import { and, asc, desc, eq, gte, inArray, isNotNull, lt, lte } from "drizzle-orm";
import * as v from "valibot";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Row = {
  exerciseId: Exercises.VO.ExerciseIdType;
  exerciseName: Exercises.VO.ExerciseNameType;
  workoutId: Workouts.VO.WorkoutIdType;
  scheduledFor: Workouts.VO.WorkoutScheduledForType;
  setNumber: Workouts.VO.SetNumberType;
  reps: Workouts.VO.RepsType;
  load: Workouts.VO.LoadType;
  rir: Workouts.VO.RirType | null;
};

const columns = {
  exerciseId: Schema.workoutExercises.exerciseId,
  exerciseName: Schema.workoutExercises.exerciseName,
  workoutId: Schema.workoutLoggedSets.workoutId,
  scheduledFor: Schema.workouts.scheduledFor,
  setNumber: Schema.workoutLoggedSets.setNumber,
  reps: Schema.workoutLoggedSets.reps,
  load: Schema.workoutLoggedSets.load,
  rir: Schema.workoutLoggedSets.rir,
};

const latestPerformance = (rows: ReadonlyArray<Row>): Workouts.Queries.ExercisePerformance | undefined => {
  const first = rows[0];
  if (!first) return undefined;

  return {
    workoutId: first.workoutId,
    scheduledFor: first.scheduledFor,
    sets: rows
      .filter((row) => row.workoutId === first.workoutId)
      .map((row) => ({
        setNumber: row.setNumber,
        reps: row.reps,
        load: row.load,
        rir: row.rir ?? undefined,
      })),
  };
};

class ListWeekExercisePerformancesQueryDrizzle implements Workouts.Queries.ListWeekExercisePerformances {
  async execute(
    userId: Auth.VO.UserIdType,
    week: tools.Week,
  ): Promise<ReadonlyArray<Workouts.Queries.WeekExercisePerformance>> {
    const start = v.parse(
      Workouts.VO.WorkoutScheduledFor,
      tools.Day.fromTimestamp(week.getStart()).toIsoId(),
    );
    const end = v.parse(Workouts.VO.WorkoutScheduledFor, tools.Day.fromTimestamp(week.getEnd()).toIsoId());

    const completed = and(
      eq(Schema.workoutLoggedSets.userId, userId),
      eq(Schema.workouts.status, Workouts.VO.WorkoutStatusEnum.completed),
      isNotNull(Schema.workouts.completedAt),
    );

    const ordered = [
      desc(Schema.workouts.scheduledFor),
      desc(Schema.workouts.completedAt),
      asc(Schema.workoutLoggedSets.setNumber),
    ];

    const current = await db
      .select(columns)
      .from(Schema.workoutLoggedSets)
      .innerJoin(
        Schema.workoutExercises,
        eq(Schema.workoutLoggedSets.workoutExerciseId, Schema.workoutExercises.id),
      )
      .innerJoin(Schema.workouts, eq(Schema.workoutLoggedSets.workoutId, Schema.workouts.id))
      .where(and(completed, gte(Schema.workouts.scheduledFor, start), lte(Schema.workouts.scheduledFor, end)))
      .orderBy(...ordered);

    if (current.length === 0) return [];

    const exerciseIds = [...new Set(current.map((row) => row.exerciseId))];

    const previous = await db
      .select(columns)
      .from(Schema.workoutLoggedSets)
      .innerJoin(
        Schema.workoutExercises,
        eq(Schema.workoutLoggedSets.workoutExerciseId, Schema.workoutExercises.id),
      )
      .innerJoin(Schema.workouts, eq(Schema.workoutLoggedSets.workoutId, Schema.workouts.id))
      .where(
        and(
          completed,
          inArray(Schema.workoutExercises.exerciseId, exerciseIds),
          lt(Schema.workouts.scheduledFor, start),
        ),
      )
      .orderBy(...ordered);

    const currentByExercise = Map.groupBy(current, (row) => row.exerciseId);
    const previousByExercise = Map.groupBy(previous, (row) => row.exerciseId);

    return [...currentByExercise].map(([exerciseId, rows]) => ({
      exerciseId,
      exerciseName: rows[0]!.exerciseName,
      current: latestPerformance(rows)!,
      previous: latestPerformance(previousByExercise.get(exerciseId) ?? []),
    }));
  }
}

export const ListWeekExercisePerformancesQuery = new ListWeekExercisePerformancesQueryDrizzle();
