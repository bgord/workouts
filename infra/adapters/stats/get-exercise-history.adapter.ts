import type * as tools from "@bgord/tools";
import { and, asc, desc, eq, isNotNull, sql } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import * as Stats from "+stats";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = { OneRepMaxCandidates: Stats.Services.OneRepMaxCandidates };

const completedAt = sql<tools.TimestampValueType>`${Schema.statsExerciseSets.completedAt}`;

const performedSets = sql`json_group_array(
  json_object('reps', ${Schema.statsExerciseSets.reps}, 'load', ${Schema.statsExerciseSets.load})
  order by ${Schema.statsExerciseSets.loggedAt} asc
)`.mapWith((value: string): Array<Stats.VO.PerformedSet> => JSON.parse(value));

class GetExerciseHistoryQueryDrizzle implements Stats.Queries.GetExerciseHistory {
  constructor(private readonly deps: Dependencies) {}

  async execute(
    exerciseId: Exercises.VO.ExerciseIdType,
    userId: Auth.VO.UserIdType,
  ): Promise<Stats.Queries.ExerciseHistoryGetResponse> {
    const completed = and(
      eq(Schema.statsExerciseSets.exerciseId, exerciseId),
      eq(Schema.statsExerciseSets.userId, userId),
      isNotNull(Schema.statsExerciseSets.completedAt),
    );

    const [logged, [record]] = await Promise.all([
      db
        .select({ workoutId: Schema.statsExerciseSets.workoutId, completedAt, sets: performedSets })
        .from(Schema.statsExerciseSets)
        .where(completed)
        .groupBy(Schema.statsExerciseSets.workoutId)
        .orderBy(desc(Schema.statsExerciseSets.completedAt)),
      db
        .select({
          reps: Schema.statsExerciseSets.reps,
          load: Schema.statsExerciseSets.load,
          workoutId: Schema.statsExerciseSets.workoutId,
          completedAt,
        })
        .from(Schema.statsExerciseSets)
        .where(completed)
        .orderBy(
          desc(Schema.statsExerciseSets.load),
          desc(Schema.statsExerciseSets.reps),
          asc(Schema.statsExerciseSets.completedAt),
          asc(Schema.statsExerciseSets.loggedAt),
        )
        .limit(1),
    ]);

    const estimated = logged.map((session) => ({
      ...session,
      candidates: this.deps.OneRepMaxCandidates.from(session),
    }));

    const measured = estimated.map(({ candidates, ...session }) => ({
      ...session,
      oneRepMaxEstimate: candidates.at(0)?.oneRepMaxEstimate,
      volume: Stats.Services.SessionVolume.calculate(session.sets),
    }));

    const sessions = measured.map((session, order) => {
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

    const [estimatedRecord] = estimated
      .flatMap((session) => session.candidates)
      .toSorted((one, another) => Stats.Services.EstimatedRecordOrder.compare(one, another));

    return { sessions, record, estimatedRecord };
  }
}

export const createGetExerciseHistoryQuery = (deps: Dependencies) => new GetExerciseHistoryQueryDrizzle(deps);
