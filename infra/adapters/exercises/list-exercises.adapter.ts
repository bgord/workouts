import type * as Exercises from "+exercises";

class ListExercisesQueryDrizzle implements Exercises.Queries.ListExercises {
  async execute(): Promise<ReadonlyArray<Exercises.VO.Exercise>> {
    return [];
  }
}

export const ListExercisesQuery = new ListExercisesQueryDrizzle();
