import { desc } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import * as Stats from "+stats";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { completed, completedAt, performedSets } from "./completed-exercise-sets";

type Dependencies = { OneRepMaxCandidates: Stats.Services.OneRepMaxCandidates };

class ListExerciseSessionsQueryDrizzle implements Stats.Queries.ListExerciseSessions {
  constructor(private readonly deps: Dependencies) {}

  async execute(
    exerciseId: Exercises.VO.ExerciseIdType,
    userId: Auth.VO.UserIdType,
  ): Promise<Array<Stats.VO.ExerciseSession>> {
    const logged = await db
      .select({ workoutId: Schema.statsExerciseSets.workoutId, completedAt, sets: performedSets })
      .from(Schema.statsExerciseSets)
      .where(completed(exerciseId, userId))
      .groupBy(Schema.statsExerciseSets.workoutId)
      .orderBy(desc(Schema.statsExerciseSets.completedAt));

    const measured = logged.map((session) => ({
      ...session,
      oneRepMaxEstimate: this.deps.OneRepMaxCandidates.from(session).at(0)?.oneRepMaxEstimate,
      volume: Stats.Services.SessionVolume.calculate(session.sets),
    }));

    return measured.map((session, order) => {
      const previous = measured.at(order + 1);

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
