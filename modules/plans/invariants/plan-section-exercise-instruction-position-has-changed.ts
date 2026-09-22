import * as bg from "@bgord/bun";
import type * as VO from "+plans/value-objects";

class PlanSectionExerciseInstructionPositionHasChangedError extends Error {}

type PlanSectionExerciseInstructionPositionHasChangedConfigType = {
  planSection: VO.PlanSection | VO.PlanSectionWithExercises | undefined;
  exerciseInstructionId: VO.ExerciseInstructionIdType;
  position: VO.ExerciseInstructionPositionType;
};

class PlanSectionExerciseInstructionPositionHasChangedFactory extends bg.Invariant<PlanSectionExerciseInstructionPositionHasChangedConfigType> {
  passes(config: PlanSectionExerciseInstructionPositionHasChangedConfigType) {
    const current = config.planSection?.exerciseInstructions.findIndex(
      (exerciseInstruction) => exerciseInstruction.id === config.exerciseInstructionId,
    );

    return current !== config.position;
  }

  // Stryker disable next-line StringLiteral
  message = "plan.section.exercise.instruction.position.has.changed";
  error = PlanSectionExerciseInstructionPositionHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanSectionExerciseInstructionPositionHasChanged =
  new PlanSectionExerciseInstructionPositionHasChangedFactory();
