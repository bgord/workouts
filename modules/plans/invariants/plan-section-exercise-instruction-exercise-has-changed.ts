import * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";

class PlanSectionExerciseInstructionExerciseHasChangedError extends Error {}

type PlanSectionExerciseInstructionExerciseHasChangedConfigType = {
  current: Exercises.VO.ExerciseIdType | undefined;
  incoming: Exercises.VO.ExerciseIdType;
};

class PlanSectionExerciseInstructionExerciseHasChangedFactory extends bg.Invariant<PlanSectionExerciseInstructionExerciseHasChangedConfigType> {
  passes(config: PlanSectionExerciseInstructionExerciseHasChangedConfigType) {
    return config.current !== config.incoming;
  }

  // Stryker disable next-line StringLiteral
  message = "plan.section.exercise.instruction.has.changed";
  error = PlanSectionExerciseInstructionExerciseHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanSectionExerciseInstructionExerciseHasChanged =
  new PlanSectionExerciseInstructionExerciseHasChangedFactory();
