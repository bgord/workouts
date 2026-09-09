import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Exercises from "+exercises";
import type * as Workouts from "+workouts";

type Dependencies = { ListExerciseSetsOHQ: Workouts.OHQ.ListExerciseSetsOHQ };

export const ExerciseSetsGet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.authenticatedUserId();
    const params = context.request.params();

    const exerciseId = v.parse(Exercises.VO.ExerciseId, params["exerciseId"]);

    const sets = await deps.ListExerciseSetsOHQ.execute(userId, exerciseId);

    return Response.json({ sets });
  };
