// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import * as ui from "../components";
import { PlanCreate } from "../sections/plan-create";
import { PlansActive } from "../sections/plans-active";
import { PlansArchived } from "../sections/plans-archived";
import { PlansEmpty } from "../sections/plans-empty";

export function Plans() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <div data-stack="x" {...ui.Gap.related}>
        <ui.Header data-grow="1">{t("plan.list.header")}</ui.Header>

        <PlanCreate />
      </div>

      <PlansEmpty />

      <PlansActive />

      <PlansArchived />
    </ui.Main>
  );
}
