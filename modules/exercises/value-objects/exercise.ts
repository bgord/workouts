import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type { ExerciseDescriptionType } from "./exercise-description";
import type { ExerciseIdType } from "./exercise-id";
import type { ExerciseNameType } from "./exercise-name";
import type { ExerciseResistanceType } from "./exercise-resistance";

export type Exercise = {
  id: ExerciseIdType;
  name: ExerciseNameType;
  description: ExerciseDescriptionType;
  resistance: ExerciseResistanceType;
  image: tools.ObjectKeyType;
  imageEtag: bg.HashValueType;
};
