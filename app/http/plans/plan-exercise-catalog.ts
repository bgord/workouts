import type * as bg from "@bgord/bun";
import type * as Plans from "+plans";

type Dependencies = { ListExerciseCatalogQuery: Plans.Queries.ListExerciseCatalog };

export const PlanExerciseCatalog =
  (deps: Dependencies): bg.EndpointPort =>
  async () => {
    const catalog = await deps.ListExerciseCatalogQuery.execute();

    return Response.json(catalog);
  };
