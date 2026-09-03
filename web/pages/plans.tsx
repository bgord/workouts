// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { PlanStatusEnum } from "../../modules/plans/value-objects/plan-status";
import { PlanCard } from "../components";
import { plansRoute } from "../router";
import { PlanCreate } from "../sections/plan-create";

export function Plans() {
  const { plans } = plansRoute.useLoaderData();
  const planCreate = bg.useToggle({ name: "plan-create" });

  const active = plans.find((plan) => plan.status !== PlanStatusEnum.archived);
  const archived = plans.filter((plan) => plan.status === PlanStatusEnum.archived);

  return (
    <main data-gap="6" data-maxw="md" data-md-m="2" data-md-pb="16" data-mx="auto" data-stack="y">
      <div data-cross="center" data-main="between" data-stack="x">
        <h1 data-fs="lg">Plans</h1>

        {!active && (
          <button className="c-button" data-variant="bare" onClick={planCreate.toggle} type="button">
            New
          </button>
        )}
      </div>

      {!active && planCreate.on && <PlanCreate />}

      {!active && archived.length === 0 && <div data-color="neutral-500">No plans created yet</div>}

      {active && (
        <ul data-gap="3" data-stack="y">
          <PlanCard plan={active} />
        </ul>
      )}

      {active && (
        <div data-color="neutral-500" data-fs="sm">
          Archive the current plan to create a new one
        </div>
      )}

      {archived.length > 0 && (
        <div data-gap="3" data-stack="y">
          <h2 data-color="neutral-300" data-fs="base">
            Archived
          </h2>

          <ul data-gap="3" data-stack="y">
            {archived.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
