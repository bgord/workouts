// fallow-ignore-file unused-export
import { useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { PlanStatusEnum } from "../../modules/plans/value-objects/plan-status";
import { PlanStatusBadge } from "../components";
import { planRoute } from "../router";
import { PlanArchive } from "../sections/plan-archive";

export function Plan() {
  const t = useTranslations();
  const { plan } = planRoute.useLoaderData();

  return (
    <main data-gap="6" data-maxw="md" data-md-m="2" data-md-pb="16" data-mx="auto" data-stack="y">
      <Link className="c-link" to="/plans">
        {`< ${t("app.back")}`}
      </Link>

      {!plan && <div data-color="neutral-500">{t("plan.not_found")}</div>}

      {plan && (
        <div data-cross="center" data-gap="3" data-stack="x">
          <h1 data-fs="lg" data-transform="truncate">
            {plan.name}
          </h1>

          <PlanStatusBadge status={plan.status} />

          {plan.status !== PlanStatusEnum.archived && <PlanArchive {...plan} />}
        </div>
      )}
    </main>
  );
}
