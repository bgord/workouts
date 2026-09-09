import { and, desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import * as Stats from "+stats";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { performedSets } from "./completed-exercise-sets";

type Dependencies = { OneRepMaxCandidates: Stats.Services.OneRepMaxCandidates };

class GetExerciseEstimatedRecordQueryDrizzle implements Stats.Queries.GetExerciseEstimatedRecord {
  constructor(private readonly deps: Dependencies) {}

  async execute(
    exerciseId: Exercises.VO.ExerciseIdType,
    userId: Auth.VO.UserIdType,
  ): Promise<Stats.VO.EstimatedRecord | undefined> {
    const logged = await db
      .select({
        workoutId: Schema.statsExerciseSets.workoutId,
        completedAt: Schema.statsExerciseSets.completedAt,
        sets: performedSets,
      })
      .from(Schema.statsExerciseSets)
      .where(
        and(eq(Schema.statsExerciseSets.exerciseId, exerciseId), eq(Schema.statsExerciseSets.userId, userId)),
      )
      .groupBy(Schema.statsExerciseSets.workoutId)
      .orderBy(desc(Schema.statsExerciseSets.completedAt));

    const [estimatedRecord] = logged
      .flatMap((session) => this.deps.OneRepMaxCandidates.from(session))
      .toSorted((one, another) => Stats.Services.EstimatedRecordOrder.compare(one, another));

    return estimatedRecord;
  }
}

export const createGetExerciseEstimatedRecordQuery = (deps: Dependencies) =>
  new GetExerciseEstimatedRecordQueryDrizzle(deps);
