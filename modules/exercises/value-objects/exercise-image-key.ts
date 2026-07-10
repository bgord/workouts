import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Exercises from "+exercises";

export class ExerciseImageKeyFactory {
  static stable(exerciseId: Exercises.VO.ExerciseIdType) {
    const filename = tools.Filename.fromParts("original", "webp").get();

    return v.parse(tools.ObjectKey, `exercises/${exerciseId}/${filename}`);
  }
}
