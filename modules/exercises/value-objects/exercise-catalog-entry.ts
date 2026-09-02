import * as v from "valibot";
import * as VO from "+exercises/value-objects";

export const ExerciseCatalogEntry = v.object({
  name: VO.ExerciseName,
  description: VO.ExerciseDescription,
  image: v.pipe(v.string(), v.minLength(1)),
});
