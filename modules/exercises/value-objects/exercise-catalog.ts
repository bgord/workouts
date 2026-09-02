import * as v from "valibot";
import { ExerciseCatalogEntry } from "./exercise-catalog-entry";

export const ExerciseCatalog = v.object({ exercises: v.array(ExerciseCatalogEntry) });

export type ExerciseCatalogType = v.InferOutput<typeof ExerciseCatalog>;
