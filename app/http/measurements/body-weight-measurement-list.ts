import type * as bg from "@bgord/bun";
import type * as Measurements from "+measurements";

type Dependencies = { ListBodyWeightMeasurementsQuery: Measurements.Queries.ListBodyWeightMeasurements };

export const BodyWeightMeasurementList =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.authenticatedUserId();

    const measurements = await deps.ListBodyWeightMeasurementsQuery.execute(userId);

    return Response.json(measurements);
  };
