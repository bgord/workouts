import * as Plans from "+plans";
import { ListExercisesForCatalogQuery } from "+infra/adapters/exercises/list-exercises-for-catalog.adapter";

class ListExerciseCatalogQueryDrizzle implements Plans.Queries.ListExerciseCatalog {
  async execute(): Promise<Plans.Queries.ExerciseCatalogResponse> {
    const exercises = await ListExercisesForCatalogQuery.execute();

    const data = exercises.map((exercise) => ({
      ...exercise,
      progressionMethods: Plans.VO.ProgressionMethodApplicability.options(exercise.resistance),
    }));

    return { data };
  }
}

export const ListExerciseCatalogQuery = new ListExerciseCatalogQueryDrizzle();
