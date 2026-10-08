import * as bg from "@bgord/ui";
import { Ruler } from "lucide-react";
import * as ui from "../components";
import { bodyPartsRoute } from "../router";
import { BodyPartDefine } from "./body-part-define";
import { BodyPartRow } from "./body-part-row";

export function BodyPartManage() {
  const t = bg.useTranslations();
  const { bodyParts } = bodyPartsRoute.useLoaderData();

  const bodyPartManage = bg.useToggle({ name: "body-part-manage" });

  return (
    <>
      <bg.MenuItem aria-haspopup="dialog" onClick={bodyPartManage.enable}>
        <Ruler data-size="sm" />
        {t("measurements.body_parts.manage.cta")}
      </bg.MenuItem>

      <ui.Dialog data-md-overflow="auto" data-overflow="hidden" {...bodyPartManage}>
        <ui.DialogHeader>
          {t("measurements.body_parts.manage.header")}
          <small data-ml="2">· {bodyParts.data.length}</small>
        </ui.DialogHeader>

        <BodyPartDefine />

        {bodyParts.data.length === 0 && (
          <ui.EmptyState>
            <ui.EmptyStateMessage>{t("measurements.body_parts.list.empty")}</ui.EmptyStateMessage>

            <small>{t("measurements.body_parts.list.empty.hint")}</small>
          </ui.EmptyState>
        )}

        {bodyParts.data.length > 0 && (
          <ul
            aria-label={t("measurements.body_parts.manage.header")}
            data-md-minh="unset"
            data-minh="0"
            data-overflow="auto"
            data-p="1"
            data-stack="y"
            style={{ margin: "calc(var(--spacing-1) * -1)" }}
          >
            {bodyParts.data.map((bodyPart, index) => (
              <BodyPartRow first={index === 0} key={bodyPart.id} {...bodyPart} />
            ))}
          </ul>
        )}

        <ui.DialogDismiss onClick={bodyPartManage.disable} />
      </ui.Dialog>
    </>
  );
}
