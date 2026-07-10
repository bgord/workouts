import type * as Exercises from "+exercises";

class GetExerciseQueryDrizzle implements Exercises.Queries.GetExercise {
  async execute(_exerciseId: Exercises.VO.ExerciseIdType): Promise<Exercises.VO.Exercise | null> {
    return null;
  }
}

export const GetExerciseQuery = new GetExerciseQueryDrizzle();
