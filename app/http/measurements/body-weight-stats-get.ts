import type * as bg from "@bgord/bun";
import type * as Measurements from "+measurements";

type Dependencies = { BodyWeightStatsCalculator: Measurements.Services.BodyWeightStatsCalculator };

export const BodyWeightStatsGet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.authenticatedUserId();

    const stats = await deps.BodyWeightStatsCalculator.calculate(userId);

    return Response.json(stats);
  };
