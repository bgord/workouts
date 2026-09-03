import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Exercises from "+exercises";
import * as Preferences from "+preferences";

type Dependencies = { FileInspection: bg.FileInspectionPort };

export function createHashFile(deps: Dependencies) {
  return new bg.HashFileSha256Adapter({
    HashContent: new bg.HashContentSha256Strategy(),
    MimeRegistry: new tools.MimeRegistry([
      ...Preferences.VO.ProfileAvatarMimeRegistry.entries,
      ...Exercises.VO.ExerciseImageMimeRegistry.entries,
    ]),
    FileReaderText: new bg.FileReaderTextAdapter(),
    ...deps,
  });
}
