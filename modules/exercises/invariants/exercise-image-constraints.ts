import * as bg from "@bgord/bun";
import * as VO from "+exercises/value-objects";

class ExerciseImageConstraintsError extends Error {}

type ExerciseImageConstraintsConfigType = bg.ImageInfoType;

class ExerciseImageConstraintsFactory extends bg.Invariant<ExerciseImageConstraintsConfigType> {
  passes(config: ExerciseImageConstraintsConfigType) {
    if (config.height > VO.ExerciseImage.MaxSide) return false;
    if (config.width > VO.ExerciseImage.MaxSide) return false;
    if (config.size.isGreaterThan(VO.ExerciseImage.MaxSize)) return false;
    return VO.ExerciseImage.MimeRegistry.hasMime(config.mime);
  }

  message = "exercise.image.constraints";
  error = ExerciseImageConstraintsError;
  kind = bg.InvariantFailureKind.precondition;
}

export const ExerciseImageConstraints = new ExerciseImageConstraintsFactory();
