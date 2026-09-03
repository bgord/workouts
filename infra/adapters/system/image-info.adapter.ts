import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Exercises from "+exercises";
import * as Preferences from "+preferences";

type Dependencies = { FileInspection: bg.FileInspectionPort };

export function createImageInfo(deps: Dependencies): bg.ImageInfoPort {
  return new bg.ImageInfoAdapter({
    MimeRegistry: new tools.MimeRegistry([
      ...Preferences.VO.ProfileAvatarMimeRegistry.entries,
      ...Exercises.VO.ExerciseImageMimeRegistry.entries,
    ]),
    ...deps,
  });
}
