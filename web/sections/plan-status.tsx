import * as bg from "@bgord/ui";
import { PlanStatusEnum } from "../../modules/plans/value-objects/plan-status";
import * as ui from "../components";
import { planRoute } from "../router";
import { PlanEditingEnable } from "./plan-editing-enable";
import { PlanFinalize } from "./plan-finalize";
import { PlanRestore } from "./plan-restore";

const tone: Record<PlanStatusEnum, ui.StatusPanelTone> = {
  [PlanStatusEnum.initial]: "outline",
  [PlanStatusEnum.draft]: "outline",
  [PlanStatusEnum.finalized]: "positive",
  [PlanStatusEnum.archived]: "muted",
  [PlanStatusEnum.removed]: "muted",
};

export function PlanStatus() {
  const t = bg.useTranslations();
  const { plan } = planRoute.useLoaderData();

  const hint = [
    { action: plan.actions.finalize, id: "plan-finalize-hint" },
    { action: plan.actions.restore, id: "plan-restore-hint" },
  ].find(({ action }) => action.available && action.hints[0]);

  return (
    <ui.StatusPanel>
      <ui.StatusPanelSummary>
        <ui.StatusPanelDot tone={tone[plan.data.status]} />

        <ui.StatusPanelText>
          <ui.StatusPanelLabel>{t(`plan.status.${plan.data.status}`)}</ui.StatusPanelLabel>

          {hint ? (
            <ui.ActionHint {...hint.action} id={hint.id} />
          ) : (
            <ui.StatusPanelDescription>
              {t(`plan.status.${plan.data.status}.description`)}
            </ui.StatusPanelDescription>
          )}
        </ui.StatusPanelText>
      </ui.StatusPanelSummary>

      <ui.StatusPanelAction>
        <PlanFinalize />

        <PlanEditingEnable />

        <PlanRestore />
      </ui.StatusPanelAction>
    </ui.StatusPanel>
  );
}
