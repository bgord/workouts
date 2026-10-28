import type * as Auth from "+auth";
import * as Exercises from "+exercises";
import { ListExercisesForCatalogQuery } from "./list-exercises-for-catalog.adapter";

class ListExercisesWithCategoriesQueryDrizzle implements Exercises.Queries.ListExercisesWithCategories {
  async execute(requesterId: Auth.VO.UserIdType): Promise<Exercises.Queries.ExerciseListResponse> {
    const data = await ListExercisesForCatalogQuery.execute();

    return { data, actions: new Exercises.Services.ExerciseListActions({ requesterId }).calculate() };
  }
}

export const ListExercisesWithCategoriesQuery = new ListExercisesWithCategoriesQueryDrizzle();
