import type * as bg from "@bgord/bun";
import * as Measurements from "+measurements";
import type * as Workouts from "+workouts";

type Dependencies = {
  Clock: bg.ClockPort;
  GetWorkoutDashboardQuery: Workouts.Queries.GetWorkoutDashboard;
  ListBodyWeightMeasurementsForStatsQuery: Measurements.Queries.ListBodyWeightMeasurementsForStats;
};

export const DashboardGet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.authenticatedUserId();

    const [workouts, measurements] = await Promise.all([
      deps.GetWorkoutDashboardQuery.execute(userId, deps.Clock.now()),
      deps.ListBodyWeightMeasurementsForStatsQuery.execute(userId),
    ]);
    const bodyWeightStats = new Measurements.Services.BodyWeightStatsCalculator(measurements).calculate();

    return Response.json({ workouts, bodyWeightStats });
  };
