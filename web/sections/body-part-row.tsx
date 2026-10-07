import * as bg from "@bgord/ui";
import type { BodyPartSummary } from "../../modules/measurements/value-objects/body-part-summary";
import * as ui from "../components";
import { BodyPartDelete } from "./body-part-delete";
import { BodyPartRename } from "./body-part-rename";

export function BodyPartRow(props: BodyPartSummary & { first: boolean }) {
  const t = bg.useTranslations();
  const pluralize = bg.usePluralize();
  const { first, measurements, ...bodyPart } = props;
  const bodyPartRename = bg.useToggle({ name: `body-part-rename-${props.id}` });

  return (
    <ui.HairlineRow
      aria-label={props.name}
      data-stack="x"
      first={first}
      tone="subtle"
      {...ui.Spacing.rowCompact}
    >
      {bodyPartRename.off && (
        <ui.RowBody>
          <span data-color="neutral-100" data-transform="truncate">
            {props.name}
          </span>

          <span data-color="neutral-500" data-fs="xs">
            {measurements.length === 0 && t("measurements.body_parts.measure.never")}
            {measurements.length > 0 &&
              t("measurements.body_parts.manage.count", {
                count: measurements.length,
                noun: pluralize({
                  value: measurements.length,
                  singular: t("measurements.body_parts.manage.count.noun.singular"),
                  plural: t("measurements.body_parts.manage.count.noun.plural"),
                  genitive: t("measurements.body_parts.manage.count.noun.genitive"),
                }),
              })}
          </span>
        </ui.RowBody>
      )}

      <BodyPartRename {...bodyPart} {...bodyPartRename} />

      {bodyPartRename.off && <BodyPartDelete {...bodyPart} />}
    </ui.HairlineRow>
  );
}
