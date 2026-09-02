import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type { ExerciseDescriptionType } from "./exercise-description";
import type { ExerciseIdType } from "./exercise-id";
import type { ExerciseNameType } from "./exercise-name";

export type Exercise = {
  id: ExerciseIdType;
  name: ExerciseNameType;
  description: ExerciseDescriptionType;
  image: tools.ObjectKeyType;
  userId: Auth.VO.UserIdType;
};
