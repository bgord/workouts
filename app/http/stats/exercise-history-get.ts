import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Exercises from "+exercises";
import type * as Stats from "+stats";

type Dependencies = {
  ListExerciseSessionsQuery: Stats.Queries.ListExerciseSessions;
  GetExerciseRecordQuery: Stats.Queries.GetExerciseRecord;
  GetExerciseEstimatedRecordQuery: Stats.Queries.GetExerciseEstimatedRecord;
};

export type ExerciseHistoryGetResponse = {
  sessions: Array<Stats.VO.ExerciseSession>;
  record?: Stats.VO.ExerciseRecord;
  estimatedRecord?: Stats.VO.EstimatedRecord;
};

export const ExerciseHistoryGet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();

    const userId = context.identity.authenticatedUserId();
    const exerciseId = v.parse(Exercises.VO.ExerciseId, params["exerciseId"]);

    const [sessions, record, estimatedRecord] = await Promise.all([
      deps.ListExerciseSessionsQuery.execute(exerciseId, userId),
      deps.GetExerciseRecordQuery.execute(exerciseId, userId),
      deps.GetExerciseEstimatedRecordQuery.execute(exerciseId, userId),
    ]);

    return Response.json({ sessions, record, estimatedRecord } satisfies ExerciseHistoryGetResponse);
  };
