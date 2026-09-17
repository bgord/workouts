// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import * as ui from "../components";
import * as Sections from "../sections";

export function Plans() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <div data-cross="center" data-stack="x" {...ui.Gap.related}>
        <ui.Header data-grow="1">{t("plan.list.header")}</ui.Header>

        <Sections.PlanCreate />
      </div>

      <Sections.PlansEmpty />

      <Sections.PlansActive />

      <Sections.PlansArchived />
    </ui.Main>
  );
}
