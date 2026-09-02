import type * as bg from "@bgord/bun";
import type * as Plans from "+plans";
import { PlanNameIsUniqueForOwner } from "../invariants/plan-name-is-unique-for-owner";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Plans.Ports.PlanRepositoryPort;
  GetPlanNameForOwnerCountQuery: Plans.Queries.GetPlanNameForOwnerCount;
};

export const handlePlanRenameCommand =
  (deps: Dependencies) => async (command: Plans.Commands.PlanRenameCommandType) => {
    const count = await deps.GetPlanNameForOwnerCountQuery.execute(
      command.payload.planName,
      command.payload.requesterId,
    );

    PlanNameIsUniqueForOwner.enforce({ count });

    const plan = await deps.repo.load(command.payload.planId);
    command.revision.validate(plan.revision.value);
    plan.rename(command.payload.planName, command.payload.requesterId);
    await deps.repo.save(plan);
  };
