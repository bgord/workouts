import type * as bg from "@bgord/bun";
import type * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Plans.Ports.PlanRepositoryPort;
};

export const handlePlanSectionExerciseInstructionUpdateCommand =
  (deps: Dependencies) => async (command: Plans.Commands.PlanSectionExerciseInstructionUpdateCommandType) => {
    const plan = await deps.repo.load(command.payload.planId);
    command.revision.validate(plan.revision.value);
    plan.updateSectionExerciseInstruction(
      command.payload.planSectionId,
      command.payload.exerciseInstruction,
      command.payload.userId,
    );
    await deps.repo.save(plan);
  };
