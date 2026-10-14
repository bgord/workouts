import type * as bg from "@bgord/bun";
import * as Measurements from "+measurements";
import type * as Workouts from "+workouts";

type Dependencies = {
  Clock: bg.ClockPort;
  GetWorkoutDashboardQuery: Workouts.Queries.GetWorkoutDashboard;
  ListBodyWeightMeasurementsForStatsQuery: Measurements.Queries.ListBodyWeightMeasurementsForStats;
  ListDailyStepsQuery: Measurements.Queries.ListDailySteps;
};

export const DashboardGet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.authenticatedUserId();

    const [workouts, measurements, dailySteps] = await Promise.all([
      deps.GetWorkoutDashboardQuery.execute(userId, deps.Clock.now()),
      deps.ListBodyWeightMeasurementsForStatsQuery.execute(userId),
      deps.ListDailyStepsQuery.execute(userId),
    ]);
    const bodyWeightStats = new Measurements.Services.BodyWeightStatsCalculator(measurements).calculate();
    const dailyStepsStats = new Measurements.Services.DailyStepsStatsCalculator(dailySteps).calculate();

    return Response.json({ workouts, bodyWeightStats, dailyStepsStats });
  };
