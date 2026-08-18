import * as bg from "@bgord/bun";
import type * as VO from "+plans/value-objects";

class PlanSectionExerciseInstructionHasChangedError extends Error {}

type PlanSectionExerciseInstructionHasChangedConfigType = {
  current: Pick<VO.ExerciseInstructionType, "sets" | "reps"> | undefined;
  incoming: Pick<VO.ExerciseInstructionType, "sets" | "reps">;
};

class PlanSectionExerciseInstructionHasChangedFactory extends bg.Invariant<PlanSectionExerciseInstructionHasChangedConfigType> {
  passes(config: PlanSectionExerciseInstructionHasChangedConfigType) {
    if (!config.current) return false;
    return (
      config.current.sets !== config.incoming.sets ||
      config.current.reps.min !== config.incoming.reps.min ||
      config.current.reps.max !== config.incoming.reps.max
    );
  }

  // Stryker disable next-line StringLiteral
  message = "plan.section.exercise.instruction.has.changed";
  error = PlanSectionExerciseInstructionHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanSectionExerciseInstructionHasChanged = new PlanSectionExerciseInstructionHasChangedFactory();
