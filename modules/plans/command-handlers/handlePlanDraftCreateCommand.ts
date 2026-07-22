import type * as bg from "@bgord/bun";
import type * as Plans from "+plans";
import { Plan } from "../aggregates/plan";
import { PlanLimitForOwner } from "../invariants/plan-limit-for-owner";
import { PlanNameIsUniqueForOwner } from "../invariants/plan-name-is-unique-for-owner";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Plans.Ports.PlanRepositoryPort;
  GetPlanNameForOwnerCountQuery: Plans.Queries.GetPlanNameForOwnerCount;
  GetPlanForOwnerCountQuery: Plans.Queries.GetPlanForOwnerCount;
};

export const handlePlanDraftCreateCommand =
  (deps: Dependencies) => async (command: Plans.Commands.PlanDraftCreateCommandType) => {
    const planCount = await deps.GetPlanForOwnerCountQuery.execute(command.payload.ownerId);

    PlanLimitForOwner.enforce({ count: planCount });

    const planNameCount = await deps.GetPlanNameForOwnerCountQuery.execute(
      command.payload.name,
      command.payload.ownerId,
    );

    PlanNameIsUniqueForOwner.enforce({ count: planNameCount });

    const plan = Plan.createDraft(command.payload.id, command.payload.name, command.payload.ownerId, deps);

    await deps.repo.save(plan);
  };
