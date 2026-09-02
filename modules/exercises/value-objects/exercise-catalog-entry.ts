import * as tools from "@bgord/tools";
import * as v from "valibot";
import { ExerciseDescription } from "./exercise-description";
import { ExerciseName } from "./exercise-name";

export const ExerciseCatalogEntry = v.object({
  name: ExerciseName,
  description: ExerciseDescription,
  image: v.pipe(
    v.string(),
    v.transform((value) => tools.FilePathRelative.fromString(value)),
  ),
});
