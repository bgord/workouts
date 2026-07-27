import type * as bg from "@bgord/bun";
import type * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Plans.Ports.PlanRepositoryPort;
};

export const handlePlanSectionExerciseInstructionExerciseChangeCommand =
  (deps: Dependencies) =>
  async (command: Plans.Commands.PlanSectionExerciseInstructionExerciseChangeCommandType) => {
    const plan = await deps.repo.load(command.payload.planId);
    command.revision.validate(plan.revision.value);
    plan.changeSectionExerciseInstructionExercise(
      command.payload.planSectionId,
      command.payload.exerciseInstruction,
      command.payload.ownerId,
    );
    await deps.repo.save(plan);
  };
