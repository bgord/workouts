import * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";

class PlanSectionExerciseExistsError extends Error {}

type PlanSectionExerciseExistsConfigType = { exercise: Exercises.VO.Exercise | null };
type PlanSectionExerciseExistsPassedConfigType = { exercise: Exercises.VO.Exercise };

class PlanSectionExerciseExistsFactory extends bg.Invariant<
  PlanSectionExerciseExistsConfigType,
  PlanSectionExerciseExistsPassedConfigType
> {
  passes(config: PlanSectionExerciseExistsConfigType) {
    return config.exercise !== null;
  }

  // Stryker disable next-line StringLiteral
  message = "plan.section.exercise.exists";
  error = PlanSectionExerciseExistsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanSectionExerciseExists = new PlanSectionExerciseExistsFactory();
