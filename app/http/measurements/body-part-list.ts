import type * as bg from "@bgord/bun";
import type * as Measurements from "+measurements";

type Dependencies = {
  ListBodyPartsQuery: Measurements.Queries.ListBodyParts;
};

export const BodyPartList =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.authenticatedUserId();
    const bodyParts = await deps.ListBodyPartsQuery.execute(userId);

    return Response.json({ bodyParts });
  };
