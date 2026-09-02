import type * as bg from "@bgord/bun";
import type * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Plans.Ports.PlanRepositoryPort;
};

export const handlePlanSectionRemoveCommand =
  (deps: Dependencies) => async (command: Plans.Commands.PlanSectionRemoveCommandType) => {
    const plan = await deps.repo.load(command.payload.planId);
    command.revision.validate(plan.revision.value);
    plan.removeSection(command.payload.planSectionId, command.payload.requesterId);
    await deps.repo.save(plan);
  };
