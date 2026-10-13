import * as bg from "@bgord/ui";
import { History } from "lucide-react";
import type { PlanHistoryEntry } from "../../modules/plans/value-objects/plan-history-entry";
import * as ui from "../components";
import { usePlanHistory } from "../hooks/use-plan-history";
import { planRoute } from "../router";

export function PlanHistory() {
  const t = bg.useTranslations();
  const { plan } = planRoute.useLoaderData();

  const planHistory = bg.useToggle({ name: "plan-history" });
  const history = usePlanHistory(plan.data.id);

  return (
    <>
      <bg.MenuItem
        aria-haspopup="dialog"
        onClick={() => {
          planHistory.enable();
          history.load();
        }}
      >
        <History data-size="sm" />
        {t("plan.history.cta")}
      </bg.MenuItem>

      <ui.Dialog data-md-overflow="auto" data-overflow="hidden" {...planHistory}>
        <ui.DialogHeader>{t("plan.history.header")}</ui.DialogHeader>

        {history.state === "error" && <ui.DialogError>{t("plan.history.error")}</ui.DialogError>}

        {history.entries.length > 0 && (
          <ul
            aria-busy={history.state === "loading"}
            aria-label={t("plan.history.header")}
            data-md-minh="unset"
            data-minh="0"
            data-overflow="auto"
            data-stack="y"
            {...ui.Gap.related}
          >
            {history.entries.map((entry) => (
              <PlanHistoryRow key={entry.sequence} {...entry} />
            ))}
          </ul>
        )}

        {history.next !== null && (
          <div data-stack="x">
            <ui.TextLink disabled={history.state === "loading"} onClick={history.more}>
              {t("plan.history.more")}
            </ui.TextLink>
          </div>
        )}

        <ui.DialogDismiss onClick={planHistory.disable} />
      </ui.Dialog>
    </>
  );
}

function PlanHistoryRow(props: PlanHistoryEntry) {
  const t = bg.useTranslations();

  const { planName, sectionName, exerciseName } = props.details;

  return (
    <li data-cross="baseline" data-main="between" data-stack="x" {...ui.Gap.cluster}>
      <span data-color="neutral-200" data-fs="sm">
        {t(`plan.history.${props.name}`, {
          planName: planName ?? "",
          sectionName: sectionName ?? "",
          exerciseName: exerciseName ?? t("plan.history.exercise.unknown"),
        })}
      </span>

      <bg.DateTime
        data-color="neutral-500"
        data-fs="xs"
        data-shrink="0"
        format="ago"
        value={props.createdAt}
      />
    </li>
  );
}
