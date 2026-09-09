import type * as tools from "@bgord/tools";
import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
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
    const completedAt = sql<tools.TimestampValueType>`${Schema.statsExerciseSets.completedAt}`;

    const logged = await db
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

    const [estimatedRecord] = logged
      .flatMap((session) => this.deps.OneRepMaxCandidates.from(session))
      .toSorted((one, another) => Stats.Services.EstimatedRecordOrder.compare(one, another));

    return estimatedRecord;
  }
}

export const createGetExerciseEstimatedRecordQuery = (deps: Dependencies) =>
  new GetExerciseEstimatedRecordQueryDrizzle(deps);
