import * as bg from "@bgord/bun";
import type * as VO from "+exercises/value-objects";

class ExerciseExistsError extends Error {}

type ExerciseExistsConfigType = { exercise: VO.Exercise | null };
type ExerciseExistsPassedConfigType = { exercise: VO.Exercise };

class ExerciseExistsFactory extends bg.Invariant<ExerciseExistsConfigType, ExerciseExistsPassedConfigType> {
  passes(config: ExerciseExistsConfigType) {
    return config.exercise !== null;
  }

  // Stryker disable next-line StringLiteral
  message = "exercise.exists";
  error = ExerciseExistsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ExerciseExists = new ExerciseExistsFactory();
