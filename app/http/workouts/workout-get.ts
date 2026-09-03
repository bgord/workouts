import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Workouts from "+workouts";

type Dependencies = { GetWorkoutQuery: Workouts.Queries.GetWorkout };

export const WorkoutGet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();

    const userId = context.identity.authenticatedUserId();
    const workoutId = v.parse(Workouts.VO.WorkoutId, params["workoutId"]);

    const workout = await deps.GetWorkoutQuery.execute(workoutId, userId);

    if (!workout) return new Response(null, { status: 404 });

    return Response.json(workout);
  };
