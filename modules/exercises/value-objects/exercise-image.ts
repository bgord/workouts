import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Exercises from "+exercises";

export class ExerciseImage {
  static readonly MaxSide = v.parse(tools.ImageWidth, 4000);
  static readonly MaxSize = tools.Size.fromMB(10);
  static readonly MimeRegistry = new tools.MimeRegistry([tools.Mimes.png, tools.Mimes.jpg, tools.Mimes.webp]);
  static readonly Side = v.parse(tools.ImageWidth, 540);

  static key(exerciseId: Exercises.VO.ExerciseIdType): tools.ObjectKeyType {
    const filename = tools.Filename.fromParts("original", "webp").get();

    return v.parse(tools.ObjectKey, `exercises/${exerciseId}/${filename}`);
  }
}
