import * as bg from "@bgord/ui";
import { Ruler } from "lucide-react";
import * as ui from "../components";
import { measurementsRoute } from "../router";
import { BodyPartDefine } from "./body-part-define";
import { BodyPartRow } from "./body-part-row";

export function BodyPartManage() {
  const t = bg.useTranslations();
  const { bodyParts } = measurementsRoute.useLoaderData();

  const bodyPartManage = bg.useToggle({ name: "body-part-manage" });

  return (
    <>
      <button
        className="c-button"
        data-variant="ghost"
        onClick={bodyPartManage.enable}
        type="button"
        {...bodyPartManage.props.controller}
      >
        <Ruler data-size="sm" />
        {t("measurements.body_parts.manage.cta")}
      </button>

      <ui.Dialog data-md-overflow="auto" data-overflow="hidden" {...bodyPartManage}>
        <ui.DialogHeader onClose={bodyPartManage.disable}>
          {t("measurements.body_parts.manage.header")}
        </ui.DialogHeader>

        <BodyPartDefine />

        {bodyParts.data.length === 0 && (
          <ui.EmptyState>
            <ui.EmptyStateMessage>{t("measurements.body_parts.list.empty")}</ui.EmptyStateMessage>

            <small>{t("measurements.body_parts.list.empty.hint")}</small>
          </ui.EmptyState>
        )}

        {bodyParts.data.length > 0 && (
          <ul data-md-minh="unset" data-minh="0" data-overflow="auto" data-stack="y">
            {bodyParts.data.map((bodyPart) => (
              <BodyPartRow key={bodyPart.id} {...bodyPart} />
            ))}
          </ul>
        )}
      </ui.Dialog>
    </>
  );
}
