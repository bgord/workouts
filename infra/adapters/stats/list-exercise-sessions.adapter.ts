import { sql, desc, and, eq, isNotNull } from "drizzle-orm";
import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import * as Stats from "+stats";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { performedSets } from "./completed-exercise-sets";

type Dependencies = { OneRepMaxCandidates: Stats.Services.OneRepMaxCandidates };

class ListExerciseSessionsQueryDrizzle implements Stats.Queries.ListExerciseSessions {
  constructor(private readonly deps: Dependencies) {}

  async execute(
    exerciseId: Exercises.VO.ExerciseIdType,
    userId: Auth.VO.UserIdType,
  ): Promise<Array<Stats.VO.ExerciseSession>> {
    const completedAt = sql<tools.TimestampValueType>`${Schema.statsExerciseSets.completedAt}`;

    const sessions = await db
      .select({ workoutId: Schema.statsExerciseSets.workoutId, completedAt, sets: performedSets })
      .from(Schema.statsExerciseSets)
      .where(
        and(
          eq(Schema.statsExerciseSets.exerciseId, exerciseId),
          eq(Schema.statsExerciseSets.userId, userId),
          isNotNull(Schema.statsExerciseSets.completedAt),
        ),
      )
      .groupBy(Schema.statsExerciseSets.workoutId)
      .orderBy(desc(Schema.statsExerciseSets.completedAt));

    const sessionsWithMeasurements = sessions.map((session) => ({
      ...session,
      oneRepMaxEstimate: this.deps.OneRepMaxCandidates.from(session).at(0)?.oneRepMaxEstimate,
      volume: Stats.Services.SessionVolume.calculate(session.sets),
    }));

    return sessionsWithMeasurements.map((session, order) => {
      const previous = sessionsWithMeasurements.at(order + 1);

      if (previous === undefined) return session;

      return {
        ...session,
        oneRepMaxEstimateDelta: Stats.Services.DeltaCalculator.between(
          session.oneRepMaxEstimate,
          previous.oneRepMaxEstimate,
        ),
        volumeDelta: Stats.Services.DeltaCalculator.between(session.volume, previous.volume),
      };
    });
  }
}

export const createListExerciseSessionsQuery = (deps: Dependencies) =>
  new ListExerciseSessionsQueryDrizzle(deps);
