import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type { ExerciseDescriptionType } from "./exercise-description";
import type { ExerciseIdType } from "./exercise-id";
import type { ExerciseLoadingType } from "./exercise-loading";
import type { ExerciseNameType } from "./exercise-name";

export type Exercise = {
  id: ExerciseIdType;
  name: ExerciseNameType;
  description: ExerciseDescriptionType;
  loading: ExerciseLoadingType;
  image: tools.ObjectKeyType;
  imageEtag: bg.HashValueType;
};
