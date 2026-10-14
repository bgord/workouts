import * as bg from "@bgord/bun";
import type * as VO from "+plans/value-objects";

class PlanSectionExerciseInstructionExistsError extends Error {}

type PlanSectionExerciseInstructionExistsConfigType = {
  exerciseInstruction: Pick<VO.ExerciseInstructionType, "id"> | undefined;
};
type PlanSectionExerciseInstructionExistsPassedConfigType = {
  exerciseInstruction: Pick<VO.ExerciseInstructionType, "id">;
};

class PlanSectionExerciseInstructionExistsFactory extends bg.Invariant<
  PlanSectionExerciseInstructionExistsConfigType,
  PlanSectionExerciseInstructionExistsPassedConfigType
> {
  passes(config: PlanSectionExerciseInstructionExistsConfigType) {
    return config.exerciseInstruction !== undefined;
  }

  // Stryker disable next-line StringLiteral
  message = "plan.section.exercise.instruction.exists";
  error = PlanSectionExerciseInstructionExistsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanSectionExerciseInstructionExists = new PlanSectionExerciseInstructionExistsFactory();
