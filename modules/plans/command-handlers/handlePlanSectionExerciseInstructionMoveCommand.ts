import type * as bg from "@bgord/bun";
import type * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Plans.Ports.PlanRepositoryPort;
};

export const handlePlanSectionExerciseInstructionMoveCommand =
  (deps: Dependencies) => async (command: Plans.Commands.PlanSectionExerciseInstructionMoveCommandType) => {
    const plan = await deps.repo.load(command.payload.planId);
    command.revision.validate(plan.revision.value);
    plan.moveSectionExerciseInstruction(
      command.payload.planSectionId,
      command.payload.exerciseInstructionId,
      command.payload.position,
      command.payload.requesterId,
    );
    await deps.repo.save(plan);
  };
