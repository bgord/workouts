import * as bg from "@bgord/bun";
import * as VO from "+exercises/value-objects";

class ExerciseImageConstraintsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ExerciseImageConstraintsError.prototype);
  }
}

type ExerciseImageConstraintsConfigType = bg.ImageInfoType;

class ExerciseImageConstraintsFactory extends bg.Invariant<ExerciseImageConstraintsConfigType> {
  passes(config: ExerciseImageConstraintsConfigType) {
    if (config.height > VO.ExerciseImageMaxSide) return false;
    if (config.width > VO.ExerciseImageMaxSide) return false;
    if (config.size.isGreaterThan(VO.ExerciseImageMaxSize)) return false;
    return VO.ExerciseImageMimeRegistry.hasMime(config.mime);
  }

  message = "exercise.image.constraints";
  error = ExerciseImageConstraintsError;
  kind = bg.InvariantFailureKind.precondition;
}

export const ExerciseImageConstraints = new ExerciseImageConstraintsFactory();
