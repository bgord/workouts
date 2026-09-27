import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  ListBodyPartMeasurementsQuery: Measurements.Queries.ListBodyPartMeasurements;
};

export const BodyPartMeasurementList =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();
    const userId = context.identity.authenticatedUserId();
    const bodyPartId = v.parse(Measurements.VO.BodyPartId, params["bodyPartId"]);
    const measurements = await deps.ListBodyPartMeasurementsQuery.execute(userId, bodyPartId);

    return Response.json({ measurements });
  };
