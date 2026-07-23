import type * as bg from "@bgord/bun";
import type * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Plans.Ports.PlanRepositoryPort;
};

export const handlePlanEditingEnableCommand =
  (deps: Dependencies) => async (command: Plans.Commands.PlanEditingEnableCommandType) => {
    const plan = await deps.repo.load(command.payload.planId);
    command.revision.validate(plan.revision.value);
    plan.enableEditing(command.payload.ownerId);
    await deps.repo.save(plan);
  };
