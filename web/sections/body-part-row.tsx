import * as bg from "@bgord/ui";
import type { BodyPart } from "../../modules/measurements/value-objects/body-part";
import * as ui from "../components";
import { BodyPartDelete } from "./body-part-delete";
import { BodyPartRename } from "./body-part-rename";

export function BodyPartRow(props: BodyPart) {
  const bodyPartRename = bg.useToggle({ name: `body-part-rename-${props.id}` });

  return (
    <li
      data-hover-bg={bodyPartRename.off ? "alpha-subtle" : undefined}
      data-main="between"
      data-px={bodyPartRename.off ? "3" : undefined}
      data-stack="x"
      {...ui.Spacing.rowCompact}
    >
      <BodyPartRename {...props} {...bodyPartRename} />

      {bodyPartRename.off && <BodyPartDelete {...props} />}
    </li>
  );
}
