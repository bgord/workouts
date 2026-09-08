import type * as bg from "@bgord/bun";
import { and, asc, desc, eq, isNotNull } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import * as Stats from "+stats";
import type * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = { Clock: bg.ClockPort };

class GetExerciseHistoryQueryDrizzle implements Stats.Queries.GetExerciseHistory {
  constructor(private readonly deps: Dependencies) {}

  async execute(
    exerciseId: Exercises.VO.ExerciseIdType,
    userId: Auth.VO.UserIdType,
  ): Promise<Stats.VO.ExerciseHistory> {
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

    const history = [...sessions.values()];

    return {
      sessions: history,
      record: new Stats.Services.ExerciseRecordFinder().find(history),
      daysSinceLastSession: new Stats.Services.ExerciseRecencyCalculator().calculate(
        history,
        this.deps.Clock.now(),
      ),
    };
  }
}

export const createGetExerciseHistoryQuery = (deps: Dependencies) => new GetExerciseHistoryQueryDrizzle(deps);
