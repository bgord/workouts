import type * as bg from "@bgord/bun";
import type * as Measurements from "+measurements";

type Dependencies = { ListBodyPartMeasurementsQuery: Measurements.Queries.ListBodyPartMeasurements };

export const BodyPartMeasurementList =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.authenticatedUserId();

    const measurements = await deps.ListBodyPartMeasurementsQuery.execute(userId);

    return Response.json(measurements);
  };
