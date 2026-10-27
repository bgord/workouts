import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Workouts from "+workouts";

export type WorkoutListCount = { matching: tools.IntegerNonNegativeType; total: tools.IntegerNonNegativeType };

export type WorkoutListResponse = {
  data: Workouts.Queries.WorkoutListPage;
  count: WorkoutListCount;
  sections: Workouts.Queries.WorkoutList["sections"];
  plan: Workouts.Queries.WorkoutList["plan"];
  actions: Workouts.Queries.WorkoutList["actions"];
};

type Dependencies = {
  Clock: bg.ClockPort;
  ListWorkoutsQuery: Workouts.Queries.ListWorkouts;
  GetWorkoutForOwnerCountQuery: Workouts.Queries.GetWorkoutForOwnerCount;
};

export const WorkoutList =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const filter =
      v.parse(Workouts.VO.WorkoutListFilter, body["filter"]) ??
      Workouts.VO.WorkoutListFilterOptions.last_week;
    const section = v.parse(v.optional(v.string()), body["section"]);
    const cursor = v.parse(v.optional(Workouts.VO.WorkoutListCursor), body["cursor"]);

    const { matching, ...workouts } = await deps.ListWorkoutsQuery.execute(
      userId,
      { filter, section, cursor, limit: Workouts.VO.WorkoutListPageLimit },
      deps.Clock.now(),
    );
    const total = await deps.GetWorkoutForOwnerCountQuery.execute(userId);

    const response: WorkoutListResponse = { ...workouts, count: { matching, total } };

    return Response.json(response);
  };
